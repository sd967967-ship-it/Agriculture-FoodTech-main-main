package com.example.controller;

import com.example.entity.Hotspot;
import com.example.entity.PredictionLog;
import com.example.repository.HotspotRepository;
import com.example.repository.PredictionLogRepository;
import com.example.service.WBCropKnowledgeBase;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1")
@CrossOrigin(origins = "*")
public class HotspotController {
    private final HotspotRepository repository;
        private final PredictionLogRepository predictionLogRepository;
        private final WBCropKnowledgeBase knowledgeBase;

        public HotspotController(HotspotRepository repository,
                     PredictionLogRepository predictionLogRepository,
                     WBCropKnowledgeBase knowledgeBase) {
        this.repository = repository;
        this.predictionLogRepository = predictionLogRepository;
        this.knowledgeBase = knowledgeBase;
    }

    @GetMapping("/hotspots")
        public List<Map<String, Object>> getHotspots(
            @RequestParam(value = "crop", required = false) String crop,
            @RequestParam(value = "days", defaultValue = "14") int days) {
        int windowDays = Math.max(1, Math.min(days, 90));
        LocalDateTime since = LocalDateTime.now().minusDays(windowDays);

        Map<String, Map<String, Object>> clusters = predictionLogRepository.findAll().stream()
            .filter(log -> log.getCreatedAt() != null && log.getCreatedAt().isAfter(since))
            .filter(log -> crop == null || crop.isBlank() || crop.equalsIgnoreCase(log.getCropType()))
            .filter(log -> log.getDistrict() != null && !log.getDistrict().isBlank())
            .collect(Collectors.toMap(
                this::predictionKey,
                this::predictionCluster,
                this::mergeClusters,
                LinkedHashMap::new));

        repository.findAll().stream()
            .filter(hotspot -> hotspot.getCreatedAt() != null
                && hotspot.getCreatedAt().isAfter(since.toInstant(ZoneOffset.UTC)))
            .map(this::manualCluster)
            .forEach(cluster -> clusters.merge(
                String.valueOf(cluster.get("district")), cluster, this::mergeClusters));

        return clusters.values().stream()
            .sorted(Comparator.comparingInt(this::caseCount).reversed())
            .toList();
    }

    @PostMapping("/hotspots")
    public ResponseEntity<Map<String, Object>> createHotspot(@RequestBody Map<String, Object> payload) {
        String district = String.valueOf(payload.getOrDefault("district", "")).trim();
        String village = String.valueOf(payload.getOrDefault("village", "")).trim();
        String riskLevel = String.valueOf(payload.getOrDefault("riskLevel", "MEDIUM")).trim().toUpperCase();
        Object caseCount = payload.get("caseCount");

        if (district.isBlank() || village.isBlank() || caseCount == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "VALIDATION_ERROR", "message", "district, village and caseCount are required."));
        }

        int count;
        try {
            count = Integer.parseInt(caseCount.toString());
        } catch (NumberFormatException exception) {
            return ResponseEntity.badRequest().body(Map.of("error", "VALIDATION_ERROR", "message", "caseCount must be a whole number."));
        }
        if (count < 0 || !(riskLevel.equals("LOW") || riskLevel.equals("MEDIUM") || riskLevel.equals("HIGH"))) {
            return ResponseEntity.badRequest().body(Map.of("error", "VALIDATION_ERROR", "message", "caseCount must be non-negative and riskLevel must be LOW, MEDIUM, or HIGH."));
        }

        Hotspot hotspot = repository.save(new Hotspot(district, village, riskLevel, count));
        return ResponseEntity.ok(toMap(hotspot));
    }

    private String predictionKey(PredictionLog log) {
        return String.join("|", log.getDistrict(), Objects.toString(log.getTopDisease(), "Unknown"),
                Objects.toString(log.getCropType(), ""));
    }

    private Map<String, Object> predictionCluster(PredictionLog log) {
        WBCropKnowledgeBase.DistrictInfo district = knowledgeBase.getDistrict(log.getDistrict());
        Map<String, Object> cluster = new LinkedHashMap<>();
        cluster.put("id", "diagnosis-" + log.getId());
        cluster.put("district", log.getDistrict());
        cluster.put("village", log.getDistrict());
        cluster.put("lat", log.getLatitude() != null ? log.getLatitude() : districtLatitude(district));
        cluster.put("lon", log.getLongitude() != null ? log.getLongitude() : districtLongitude(district));
        cluster.put("cases", 1);
        cluster.put("caseCount", 1);
        cluster.put("crop", log.getCropType());
        cluster.put("topIssue", Objects.toString(log.getTopDisease(), "Reported crop issue"));
        cluster.put("action", log.getIsEscalated() != null && log.getIsEscalated()
                ? "Expert review recommended for this report."
                : "Inspect nearby plants and compare symptoms before treatment.");
        cluster.put("riskLevel", riskForConfidence(log.getConfidence()));
        cluster.put("createdAt", log.getCreatedAt());
        return cluster;
    }

    private Map<String, Object> manualCluster(Hotspot hotspot) {
        WBCropKnowledgeBase.DistrictInfo district = knowledgeBase.getDistrict(hotspot.getDistrict());
        Map<String, Object> cluster = toMap(hotspot);
        cluster.put("lat", districtLatitude(district));
        cluster.put("lon", districtLongitude(district));
        cluster.put("cases", hotspot.getCaseCount());
        cluster.put("topIssue", "Reported pest or disease hotspot");
        cluster.put("action", "Inspect the reported area and contact the local agriculture office if cases increase.");
        return cluster;
    }

    private Map<String, Object> mergeClusters(Map<String, Object> left, Map<String, Object> right) {
        Map<String, Object> merged = new LinkedHashMap<>(left);
        int count = caseCount(left) + caseCount(right);
        merged.put("cases", count);
        merged.put("caseCount", count);
        if (riskRank(String.valueOf(right.get("riskLevel"))) > riskRank(String.valueOf(left.get("riskLevel")))) {
            merged.put("riskLevel", right.get("riskLevel"));
        }
        return merged;
    }

    private int caseCount(Map<String, Object> cluster) {
        Object value = cluster.get("cases");
        return value instanceof Number number ? number.intValue() : 0;
    }

    private int riskRank(String risk) {
        return "HIGH".equals(risk) ? 3 : "MEDIUM".equals(risk) ? 2 : 1;
    }

    private String riskForConfidence(Double confidence) {
        if (confidence != null && confidence >= 0.7) return "HIGH";
        if (confidence != null && confidence >= 0.5) return "MEDIUM";
        return "LOW";
    }

    private double districtLatitude(WBCropKnowledgeBase.DistrictInfo district) {
        return district != null ? district.latitude() : 23.5;
    }

    private double districtLongitude(WBCropKnowledgeBase.DistrictInfo district) {
        return district != null ? district.longitude() : 87.8;
    }

    private Map<String, Object> toMap(Hotspot hotspot) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", hotspot.getId());
        map.put("district", hotspot.getDistrict());
        map.put("village", hotspot.getVillage());
        map.put("riskLevel", hotspot.getRiskLevel());
        map.put("caseCount", hotspot.getCaseCount());
        map.put("cases", hotspot.getCaseCount());
        map.put("createdAt", hotspot.getCreatedAt());
        return map;
    }
}
