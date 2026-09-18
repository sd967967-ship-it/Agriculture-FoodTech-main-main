package com.example.controller;

import com.example.entity.Referral;
import com.example.repository.ReferralRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
@CrossOrigin(origins = "*")
public class ReferralController {
    private final ReferralRepository repository;

    public ReferralController(ReferralRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/referrals")
    public List<Map<String, Object>> getReferrals() {
        return repository.findAll().stream().map(this::toMap).toList();
    }

    @PostMapping("/referrals")
    public ResponseEntity<Map<String, Object>> createReferral(@RequestBody Map<String, String> payload) {
        String farmerUsername = payload.getOrDefault("farmerUsername", "").trim();
        String crop = payload.getOrDefault("crop", "").trim();
        String sampleId = payload.getOrDefault("sampleId", "").trim();
        String status = payload.getOrDefault("status", "RECEIVED").trim();

        if (farmerUsername.isBlank() || crop.isBlank() || sampleId.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "VALIDATION_ERROR", "message", "farmerUsername, crop and sampleId are required."));
        }

        Referral referral = repository.save(new Referral(farmerUsername, crop, sampleId, status));
        return ResponseEntity.ok(toMap(referral));
    }

    @PutMapping("/referrals/{id}/result")
    public ResponseEntity<Map<String, Object>> updateResult(@PathVariable("id") long id, @RequestBody Map<String, String> payload) {
        Referral referral = repository.findById(id).orElse(null);
        if (referral == null) {
            return ResponseEntity.notFound().build();
        }
        String status = payload.getOrDefault("status", referral.getStatus());
        String result = payload.getOrDefault("result", referral.getResult());
        referral.setStatus(status);
        referral.setResult(result);
        return ResponseEntity.ok(toMap(repository.save(referral)));
    }

    private Map<String, Object> toMap(Referral referral) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", referral.getId());
        map.put("farmerUsername", referral.getFarmerUsername());
        map.put("crop", referral.getCrop());
        map.put("sampleId", referral.getSampleId());
        map.put("status", referral.getStatus());
        map.put("result", referral.getResult());
        map.put("createdAt", referral.getCreatedAt());
        return map;
    }
}
