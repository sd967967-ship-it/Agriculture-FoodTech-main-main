package com.example.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
@CrossOrigin(origins = "*")
public class AgronomicRecommendationController {

    @GetMapping("/recommendations")
    public ResponseEntity<Map<String, Object>> getRecommendations(@RequestParam(value = "crop", defaultValue = "Rice") String crop,
                                            @RequestParam(value = "district", defaultValue = "Nadia") String district) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("crop", crop);
        body.put("district", district);
        body.put("recommendation", "Use district-appropriate agronomic practices, balanced nutrition, and KVK guidance for disease management.");
        body.put("source", "KVK fallback + field advisory");
        return ResponseEntity.ok(body);
    }

    @PostMapping("/recommendations")
    public ResponseEntity<Map<String, Object>> getRecommendations(@RequestBody Map<String, String> payload) {
        String crop = payload.getOrDefault("crop", "Rice");
        String district = payload.getOrDefault("district", "Nadia");
        return getRecommendations(crop, district);
    }
}
