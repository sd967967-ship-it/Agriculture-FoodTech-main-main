package com.example.controller;

import com.example.entity.MonitoringPlan;
import com.example.repository.MonitoringPlanRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
@CrossOrigin(origins = "*")
public class MonitoringPlanController {

    private final MonitoringPlanRepository monitoringPlanRepository;

    public MonitoringPlanController(MonitoringPlanRepository monitoringPlanRepository) {
        this.monitoringPlanRepository = monitoringPlanRepository;
    }

    @GetMapping("/monitoring-plans")
    public List<Map<String, Object>> getPlans(@RequestParam(value = "farmerUsername", required = false) String farmerUsername) {
        List<MonitoringPlan> plans = (farmerUsername == null || farmerUsername.isBlank())
                ? monitoringPlanRepository.findAll()
                : monitoringPlanRepository.findByFarmerUsernameOrderByCreatedAtDesc(farmerUsername);
        return plans.stream().map(this::toMap).toList();
    }

    @PostMapping("/monitoring-plans")
    public ResponseEntity<Map<String, Object>> createMonitoringPlan(@RequestBody Map<String, Object> payload) {
        String farmerUsername = String.valueOf(payload.getOrDefault("farmerUsername", "")).trim();
        String crop = String.valueOf(payload.getOrDefault("crop", "")).trim();
        Object intervalObject = payload.get("intervalDays");

        if (farmerUsername.isBlank() || crop.isBlank() || intervalObject == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "VALIDATION_ERROR", "message", "farmerUsername, crop and intervalDays are required."));
        }

        Integer intervalDays = Integer.parseInt(intervalObject.toString());
        MonitoringPlan plan = monitoringPlanRepository.save(new MonitoringPlan(farmerUsername, crop, intervalDays));
        return ResponseEntity.ok(toMap(plan));
    }

    private Map<String, Object> toMap(MonitoringPlan plan) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", plan.getId());
        map.put("farmerUsername", plan.getFarmerUsername());
        map.put("crop", plan.getCrop());
        map.put("intervalDays", plan.getIntervalDays());
        map.put("createdAt", plan.getCreatedAt());
        return map;
    }
}
