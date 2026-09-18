package com.example.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * Response payload for the disease-risk forecast endpoint.
 */
public record DiseaseRiskDTO(
        Long farmId,
        String farmName,
        String district,
        String crop,
        String riskLevel,
        List<DiseaseScore> diseases,
        Map<String, Object> weatherSnapshot,
        String assessedAt) {

    /**
     * Per-disease breakdown showing whether forecast weather falls
     * within the disease's favourable thresholds.
     */
    public record DiseaseScore(
            String diseaseName,
            boolean tempInRange,
            boolean humidityExceeded,
            boolean rainfallExceeded,
            int matchedThresholds,
            String severity) {
    }
}
