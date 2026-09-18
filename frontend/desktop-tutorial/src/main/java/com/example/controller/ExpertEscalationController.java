package com.example.controller;

import com.example.entity.ExpertEscalation;
import com.example.repository.ExpertEscalationRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
@CrossOrigin(origins = "*")
public class ExpertEscalationController {
    private final ExpertEscalationRepository repository;

    public ExpertEscalationController(ExpertEscalationRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/expert-escalations")
    public List<Map<String, Object>> getEscalations() {
        return repository.findAll().stream().map(this::toMap).toList();
    }

    @PostMapping("/expert-escalations")
    public ResponseEntity<Map<String, Object>> createEscalation(@RequestBody Map<String, String> payload) {
        String farmerUsername = payload.getOrDefault("farmerUsername", "").trim();
        String status = payload.getOrDefault("status", "OPEN").trim();
        String assignedExpert = payload.getOrDefault("assignedExpert", "expert@demo").trim();
        String notes = payload.getOrDefault("notes", "").trim();

        if (farmerUsername.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "VALIDATION_ERROR", "message", "farmerUsername is required."));
        }

        ExpertEscalation escalation = repository.save(new ExpertEscalation(farmerUsername, status, assignedExpert, notes));
        return ResponseEntity.ok(toMap(escalation));
    }

    private Map<String, Object> toMap(ExpertEscalation escalation) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", escalation.getId());
        map.put("farmerUsername", escalation.getFarmerUsername());
        map.put("status", escalation.getStatus());
        map.put("assignedExpert", escalation.getAssignedExpert());
        map.put("notes", escalation.getNotes());
        map.put("createdAt", escalation.getCreatedAt());
        return map;
    }
}
