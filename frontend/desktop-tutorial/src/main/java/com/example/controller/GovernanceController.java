package com.example.controller;

import com.example.entity.GovernanceConsent;
import com.example.repository.GovernanceConsentRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
@CrossOrigin(origins = "*")
public class GovernanceController {
    private final GovernanceConsentRepository repository;

    public GovernanceController(GovernanceConsentRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/consents")
    public List<Map<String, Object>> getConsents() {
        return repository.findAll().stream().map(this::toMap).toList();
    }

    @PostMapping("/consents")
    public ResponseEntity<Map<String, Object>> createConsent(@RequestBody Map<String, Object> payload) {
        String farmerUsername = String.valueOf(payload.getOrDefault("farmerUsername", "")).trim();
        String consentType = String.valueOf(payload.getOrDefault("consentType", "")).trim();
        Object grantedObj = payload.get("granted");
        if (farmerUsername.isBlank() || consentType.isBlank() || grantedObj == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "VALIDATION_ERROR", "message", "farmerUsername, consentType and granted are required."));
        }

        GovernanceConsent consent = repository.save(new GovernanceConsent(farmerUsername, consentType, Boolean.parseBoolean(grantedObj.toString())));
        return ResponseEntity.ok(toMap(consent));
    }

    private Map<String, Object> toMap(GovernanceConsent consent) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", consent.getId());
        map.put("farmerUsername", consent.getFarmerUsername());
        map.put("consentType", consent.getConsentType());
        map.put("granted", consent.isGranted());
        map.put("createdAt", consent.getCreatedAt());
        return map;
    }
}
