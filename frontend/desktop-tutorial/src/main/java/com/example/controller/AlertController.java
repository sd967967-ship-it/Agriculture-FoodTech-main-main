package com.example.controller;

import com.example.entity.AlertMessage;
import com.example.repository.AlertMessageRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
@CrossOrigin(origins = "*")
public class AlertController {

    private final AlertMessageRepository alertMessageRepository;

    public AlertController(AlertMessageRepository alertMessageRepository) {
        this.alertMessageRepository = alertMessageRepository;
    }

    @GetMapping("/alerts")
    public List<Map<String, Object>> getAlerts(@RequestParam(value = "farmerUsername", required = false) String farmerUsername) {
        List<AlertMessage> alerts = (farmerUsername == null || farmerUsername.isBlank())
                ? alertMessageRepository.findAll()
                : alertMessageRepository.findByFarmerUsernameOrderByCreatedAtDesc(farmerUsername);
        return alerts.stream().map(this::toMap).toList();
    }

    @PostMapping("/alerts")
    public ResponseEntity<Map<String, Object>> createAlert(@RequestBody Map<String, String> payload) {
        String farmerUsername = payload.getOrDefault("farmerUsername", "").trim();
        String title = payload.getOrDefault("title", "").trim();
        String message = payload.getOrDefault("message", "").trim();
        String level = payload.getOrDefault("level", "INFO").trim();

        if (farmerUsername.isBlank() || title.isBlank() || message.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "VALIDATION_ERROR", "message", "farmerUsername, title and message are required."));
        }

        AlertMessage alert = alertMessageRepository.save(new AlertMessage(farmerUsername, title, message, level));
        return ResponseEntity.ok(toMap(alert));
    }

    private Map<String, Object> toMap(AlertMessage alert) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", alert.getId());
        map.put("farmerUsername", alert.getFarmerUsername());
        map.put("title", alert.getTitle());
        map.put("message", alert.getMessage());
        map.put("level", alert.getLevel());
        map.put("createdAt", alert.getCreatedAt());
        return map;
    }
}
