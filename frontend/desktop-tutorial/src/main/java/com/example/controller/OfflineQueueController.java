package com.example.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
@CrossOrigin(origins = "*")
public class OfflineQueueController {

    @PostMapping("/offline-queue")
    public ResponseEntity<Map<String, Object>> enqueue(@RequestBody Map<String, Object> payload) {
        String farmerUsername = String.valueOf(payload.getOrDefault("farmerUsername", "")).trim();
        String entityType = String.valueOf(payload.getOrDefault("entityType", "")).trim();
        if (farmerUsername.isBlank() || entityType.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "VALIDATION_ERROR", "message", "farmerUsername and entityType are required."));
        }
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("queued", true);
        response.put("farmerUsername", farmerUsername);
        response.put("entityType", entityType);
        response.put("status", "PENDING_SYNC");
        return ResponseEntity.ok(response);
    }
}
