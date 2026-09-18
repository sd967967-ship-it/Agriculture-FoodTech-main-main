package com.example.controller;

import com.example.entity.PestObservation;
import com.example.repository.PestObservationRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.time.format.DateTimeParseException;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping({"/api/v1", "/api"})
@CrossOrigin(origins = "*")
public class PestObservationController {

    private final PestObservationRepository repository;

    public PestObservationController(PestObservationRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/pest-observations")
    public List<Map<String, Object>> getPestObservations(@RequestParam(value = "farmId", required = false) Long farmId) {
        List<PestObservation> list = (farmId != null)
                ? repository.findByFarmIdOrderByTimestampDesc(farmId)
                : repository.findAllByOrderByTimestampDesc();
        return list.stream().map(this::toMap).toList();
    }

    @PostMapping("/pest-observations")
    public ResponseEntity<?> createPestObservation(@RequestBody Map<String, Object> payload) {
        Object farmIdObj = payload.get("farmId");
        String pestType = payload.get("pestType") != null ? String.valueOf(payload.get("pestType")).trim() : "";
        Object countObj = payload.get("count");
        String source = payload.get("source") != null ? String.valueOf(payload.get("source")).trim().toLowerCase() : "manual";
        if (source.isEmpty()) {
            source = "manual";
        }

        if (farmIdObj == null || pestType.isEmpty() || countObj == null) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "VALIDATION_ERROR",
                    "message", "farmId, pestType and count are required."
            ));
        }

        Long farmId;
        try {
            farmId = Long.parseLong(farmIdObj.toString());
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "VALIDATION_ERROR",
                    "message", "farmId must be a valid number."
            ));
        }

        int count;
        try {
            count = Integer.parseInt(countObj.toString());
            if (count < 0) {
                return ResponseEntity.badRequest().body(Map.of(
                        "error", "VALIDATION_ERROR",
                        "message", "count cannot be negative."
                ));
            }
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "VALIDATION_ERROR",
                    "message", "count must be a valid integer."
            ));
        }

        if (!"manual".equals(source) && !"sensor".equals(source)) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "VALIDATION_ERROR",
                    "message", "source must be either 'manual' or 'sensor'."
            ));
        }

        Instant timestamp = Instant.now();
        Object timestampObj = payload.get("timestamp");
        if (timestampObj != null && !timestampObj.toString().isBlank()) {
            try {
                timestamp = Instant.parse(timestampObj.toString());
            } catch (DateTimeParseException e) {
                // Also support epoch millis or local fallback if needed
                try {
                    long epochMillis = Long.parseLong(timestampObj.toString());
                    timestamp = Instant.ofEpochMilli(epochMillis);
                } catch (NumberFormatException nfe) {
                    return ResponseEntity.badRequest().body(Map.of(
                            "error", "VALIDATION_ERROR",
                            "message", "timestamp must be a valid ISO-8601 string or epoch milliseconds."
                    ));
                }
            }
        }

        PestObservation observation = new PestObservation(farmId, pestType, count, source, timestamp);
        PestObservation saved = repository.save(observation);
        return ResponseEntity.ok(toMap(saved));
    }

    private Map<String, Object> toMap(PestObservation obs) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", obs.getId());
        map.put("farmId", obs.getFarmId());
        map.put("pestType", obs.getPestType());
        map.put("count", obs.getCount());
        map.put("source", obs.getSource());
        map.put("timestamp", obs.getTimestamp().toString());
        return map;
    }
}
