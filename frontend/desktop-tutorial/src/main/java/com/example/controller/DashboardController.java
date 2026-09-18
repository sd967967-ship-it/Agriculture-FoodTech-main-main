package com.example.controller;

import com.example.repository.*;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping({"/api/v1", "/api"})
@CrossOrigin(origins = "*")
public class DashboardController {
    private final FarmRepository farmRepository;
    private final FieldRepository fieldRepository;
    private final DiagnosisFeedbackRepository diagnosisFeedbackRepository;
    private final AlertMessageRepository alertMessageRepository;
    private final MonitoringPlanRepository monitoringPlanRepository;
    private final ExpertEscalationRepository expertEscalationRepository;
    private final ReferralRepository referralRepository;

    public DashboardController(FarmRepository farmRepository, FieldRepository fieldRepository,
                              DiagnosisFeedbackRepository diagnosisFeedbackRepository,
                              AlertMessageRepository alertMessageRepository,
                              MonitoringPlanRepository monitoringPlanRepository,
                              ExpertEscalationRepository expertEscalationRepository,
                              ReferralRepository referralRepository) {
        this.farmRepository = farmRepository;
        this.fieldRepository = fieldRepository;
        this.diagnosisFeedbackRepository = diagnosisFeedbackRepository;
        this.alertMessageRepository = alertMessageRepository;
        this.monitoringPlanRepository = monitoringPlanRepository;
        this.expertEscalationRepository = expertEscalationRepository;
        this.referralRepository = referralRepository;
    }

    @GetMapping({"/dashboard", "/admin/dashboard"})
    public Map<String, Object> getDashboard() {
        return getSummary();
    }

    @GetMapping("/dashboard/summary")
    public Map<String, Object> getSummary() {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("farmCount", farmRepository.count());
        map.put("fieldCount", fieldRepository.count());
        map.put("feedbackCount", diagnosisFeedbackRepository.count());
        map.put("alertCount", alertMessageRepository.count());
        map.put("monitoringPlanCount", monitoringPlanRepository.count());
        map.put("status", "OK");
        map.put("districts", java.util.List.of("Nadia", "Murshidabad", "Bardhaman"));
        map.put("activeHotspots", 6);
        map.put("complianceRate", 92.4);
        map.put("reviews", buildReviewQueue());
        return map;
    }

    private java.util.List<Map<String, Object>> buildReviewQueue() {
        java.util.List<Map<String, Object>> queue = new java.util.ArrayList<>();
        expertEscalationRepository.findAll().forEach(escalation -> {
            Map<String, Object> review = new LinkedHashMap<>();
            review.put("id", "EXP-" + escalation.getId());
            review.put("farmer", escalation.getFarmerUsername());
            review.put("location", "District monitoring zone");
            review.put("crop", "Expert review");
            review.put("diagnosis", escalation.getNotes());
            review.put("status", escalation.getStatus());
            queue.add(review);
        });
        referralRepository.findAll().forEach(referral -> {
            Map<String, Object> review = new LinkedHashMap<>();
            review.put("id", referral.getSampleId());
            review.put("farmer", referral.getFarmerUsername());
            review.put("location", "District laboratory");
            review.put("crop", referral.getCrop());
            review.put("diagnosis", "Laboratory confirmation pending");
            review.put("status", referral.getStatus());
            queue.add(review);
        });
        return queue;
    }
}
