package com.example.controller;

import com.example.entity.TrapReading;
import com.example.repository.TrapReadingRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
@CrossOrigin(origins = "*")
public class TrapReadingController {
    private final TrapReadingRepository repository;

    public TrapReadingController(TrapReadingRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/trap-readings")
    public List<Map<String, Object>> getTrapReadings() {
        return repository.findAll().stream().map(this::toMap).toList();
    }

    @PostMapping("/trap-readings")
    public ResponseEntity<Map<String, Object>> createTrapReading(@RequestBody Map<String, Object> payload) {
        String farmerUsername = String.valueOf(payload.getOrDefault("farmerUsername", "")).trim();
        String trapType = String.valueOf(payload.getOrDefault("trapType", "")).trim();
        Object count = payload.get("count");
        if (farmerUsername.isBlank() || trapType.isBlank() || count == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "VALIDATION_ERROR", "message", "farmerUsername, trapType and count are required."));
        }

        TrapReading reading = repository.save(new TrapReading(farmerUsername, trapType, Integer.parseInt(count.toString())));
        return ResponseEntity.ok(toMap(reading));
    }

    private Map<String, Object> toMap(TrapReading reading) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", reading.getId());
        map.put("farmerUsername", reading.getFarmerUsername());
        map.put("trapType", reading.getTrapType());
        map.put("count", reading.getCount());
        map.put("createdAt", reading.getCreatedAt());
        return map;
    }
}
