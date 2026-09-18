package com.example.controller;

import com.example.entity.SensorReading;
import com.example.repository.SensorReadingRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
@CrossOrigin(origins = "*")
public class SensorReadingController {
    private final SensorReadingRepository repository;

    public SensorReadingController(SensorReadingRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/sensor-readings")
    public List<Map<String, Object>> getSensorReadings() {
        return repository.findAll().stream().map(this::toMap).toList();
    }

    @PostMapping("/sensor-readings")
    public ResponseEntity<Map<String, Object>> createSensorReading(@RequestBody Map<String, Object> payload) {
        String farmerUsername = String.valueOf(payload.getOrDefault("farmerUsername", "")).trim();
        String sensorType = String.valueOf(payload.getOrDefault("sensorType", "")).trim();
        Object value = payload.get("value");
        if (farmerUsername.isBlank() || sensorType.isBlank() || value == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "VALIDATION_ERROR", "message", "farmerUsername, sensorType and value are required."));
        }

        SensorReading reading = repository.save(new SensorReading(farmerUsername, sensorType, Double.parseDouble(value.toString())));
        return ResponseEntity.ok(toMap(reading));
    }

    private Map<String, Object> toMap(SensorReading reading) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", reading.getId());
        map.put("farmerUsername", reading.getFarmerUsername());
        map.put("sensorType", reading.getSensorType());
        map.put("value", reading.getValue());
        map.put("createdAt", reading.getCreatedAt());
        return map;
    }
}
