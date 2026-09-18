package com.example.service;

import com.example.dto.DiseaseRiskDTO;
import com.example.entity.Farm;
import com.example.repository.FarmRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

/**
 * Runs a daily disease-risk assessment for every registered farm.
 * Executes at 06:00 AM server time each day.
 */
@Component
public class DiseaseRiskScheduler {

    private static final Logger log = LoggerFactory.getLogger(DiseaseRiskScheduler.class);

    private final FarmRepository farmRepository;
    private final WeatherService weatherService;
    private final WBCropKnowledgeBase knowledgeBase;

    public DiseaseRiskScheduler(FarmRepository farmRepository,
                                WeatherService weatherService,
                                WBCropKnowledgeBase knowledgeBase) {
        this.farmRepository = farmRepository;
        this.weatherService = weatherService;
        this.knowledgeBase = knowledgeBase;
    }

    /**
     * Daily disease-risk sweep. Logs risk for every farm; HIGH risks are
     * logged at WARN level so monitoring systems can pick them up.
     */
    @Scheduled(cron = "0 0 6 * * *")
    public void assessAllFarms() {
        List<Farm> farms = farmRepository.findAll();
        log.info("Daily disease-risk assessment started for {} farm(s)", farms.size());

        int highCount = 0;

        for (Farm farm : farms) {
            try {
                WBCropKnowledgeBase.DistrictInfo district = knowledgeBase.getDistrict(farm.getDistrict());
                Double lat = district != null ? district.latitude() : null;
                Double lon = district != null ? district.longitude() : null;

                Map<String, Object> forecast = weatherService.getLiveWeather(lat, lon);
                DiseaseRiskDTO risk = weatherService.calculateDiseaseRisk(farm, forecast);

                if ("HIGH".equals(risk.riskLevel())) {
                    highCount++;
                    log.warn("HIGH disease risk — Farm '{}' (id={}) crop={} district={}",
                            farm.getName(), farm.getId(), risk.crop(), farm.getDistrict());
                } else {
                    log.info("Disease risk {} — Farm '{}' (id={}) crop={}",
                            risk.riskLevel(), farm.getName(), farm.getId(), risk.crop());
                }
            } catch (Exception e) {
                log.error("Failed to assess disease risk for Farm '{}' (id={}): {}",
                        farm.getName(), farm.getId(), e.getMessage(), e);
            }
        }

        log.info("Daily disease-risk assessment complete. {} farm(s) at HIGH risk.", highCount);
    }
}
