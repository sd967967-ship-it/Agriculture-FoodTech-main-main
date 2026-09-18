package com.example.controller;

import com.example.entity.DiagnosisFeedback;
import com.example.repository.DiagnosisFeedbackRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
@CrossOrigin(origins = "*")
public class DiagnosisFeedbackController {

    private final DiagnosisFeedbackRepository diagnosisFeedbackRepository;

    public DiagnosisFeedbackController(DiagnosisFeedbackRepository diagnosisFeedbackRepository) {
        this.diagnosisFeedbackRepository = diagnosisFeedbackRepository;
    }

    @GetMapping("/diagnosis-feedback")
    public List<Map<String, Object>> getFeedback(@RequestParam(value = "farmerUsername", required = false) String farmerUsername) {
        List<DiagnosisFeedback> feedback = (farmerUsername == null || farmerUsername.isBlank())
                ? diagnosisFeedbackRepository.findAll()
                : diagnosisFeedbackRepository.findByFarmerUsernameOrderByCreatedAtDesc(farmerUsername);
        return feedback.stream().map(this::toMap).toList();
    }

    @PostMapping("/diagnosis-feedback")
    public ResponseEntity<Map<String, Object>> createFeedback(@RequestBody Map<String, String> payload) {
        String farmerUsername = payload.getOrDefault("farmerUsername", "").trim();
        String diagnosis = payload.getOrDefault("diagnosis", "").trim();
        String label = payload.getOrDefault("label", "").trim();
        String modelVersion = payload.getOrDefault("modelVersion", "unknown").trim();

        if (farmerUsername.isBlank() || diagnosis.isBlank() || label.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "VALIDATION_ERROR", "message", "farmerUsername, diagnosis and label are required."));
        }

        DiagnosisFeedback feedback = diagnosisFeedbackRepository.save(new DiagnosisFeedback(farmerUsername, diagnosis, label, modelVersion));
        return ResponseEntity.ok(toMap(feedback));
    }

    private Map<String, Object> toMap(DiagnosisFeedback feedback) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", feedback.getId());
        map.put("farmerUsername", feedback.getFarmerUsername());
        map.put("diagnosis", feedback.getDiagnosis());
        map.put("label", feedback.getLabel());
        map.put("modelVersion", feedback.getModelVersion());
        map.put("createdAt", feedback.getCreatedAt());
        return map;
    }
}
