package com.example.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
@CrossOrigin(origins = "*")
public class ImageValidationController {

    @PostMapping("/image-validation")
    public ResponseEntity<Map<String, Object>> validate(@RequestBody Map<String, Object> payload) {
        String crop = String.valueOf(payload.getOrDefault("crop", "")).trim();
        Object brightness = payload.get("brightness");
        Object qualityScore = payload.get("qualityScore");
        Object pestVisible = payload.get("pestVisible");

        String status = "VALID";
        if (crop.isBlank() || brightness == null || qualityScore == null) {
            status = "INVALID";
        } else {
            double brightnessValue;
            double qualityValue;
            try {
                brightnessValue = Double.parseDouble(brightness.toString());
                qualityValue = Double.parseDouble(qualityScore.toString());
            } catch (NumberFormatException exception) {
                status = "INVALID";
                brightnessValue = 0;
                qualityValue = 0;
            }
            if (status.equals("VALID") && (Double.isNaN(brightnessValue) || Double.isNaN(qualityValue)
                    || brightnessValue < 30 || qualityValue < 60 || Boolean.TRUE.equals(pestVisible))) {
                status = "RETAKE";
            }
        }

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("status", status);
        response.put("crop", crop);
        response.put("message", status.equals("RETAKE") ? "Retake image to improve clarity before diagnosis." : "Image passed basic validation.");
        return ResponseEntity.ok(response);
    }
}
