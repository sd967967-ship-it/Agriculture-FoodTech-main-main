package com.example.service;

import com.example.dto.DiseaseRiskDTO;
import com.example.entity.Farm;
import com.example.entity.Field;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

class DiseaseRiskTest {

    private WeatherService weatherService;
    private WBCropKnowledgeBase knowledgeBase;

    @BeforeEach
    void setUp() {
        knowledgeBase = new WBCropKnowledgeBase();
        weatherService = new WeatherService(knowledgeBase);
    }

    @Test
    void marksHotHumidRainyConditionsAsHighRiskForRice() {
        Farm farm = new Farm("Burdwan Green", "subhas_roy", "Purba Bardhaman");
        farm.setFields(List.of(new Field("Main Plot", "Rice", "Kharif", farm)));

        Map<String, Object> forecast = Map.of(
                "temperatureC", 26.0,
                "humidityPercent", 90.0,
                "rainMm", 8.0
        );

        DiseaseRiskDTO risk = weatherService.calculateDiseaseRisk(farm, forecast);

        assertThat(risk.crop()).isEqualTo("Rice");
        assertThat(risk.riskLevel()).isEqualTo("HIGH");
        assertThat(risk.diseases()).isNotEmpty();

        DiseaseRiskDTO.DiseaseScore blastScore = risk.diseases().stream()
                .filter(d -> "Blast".equals(d.diseaseName()))
                .findFirst()
                .orElse(null);

        assertThat(blastScore).isNotNull();
        assertThat(blastScore.tempInRange()).isTrue();
        assertThat(blastScore.humidityExceeded()).isTrue();
        assertThat(blastScore.rainfallExceeded()).isTrue();
        assertThat(blastScore.matchedThresholds()).isEqualTo(3);
        assertThat(blastScore.severity()).isEqualTo("HIGH");
    }

    @Test
    void marksCoolDryConditionsAsLowRiskForRice() {
        Farm farm = new Farm("Winter Farm", "subhas_roy", "Purba Bardhaman");
        farm.setFields(List.of(new Field("Main Plot", "Rice", "Boro", farm)));

        Map<String, Object> forecast = Map.of(
                "temperatureC", 12.0,
                "humidityPercent", 35.0,
                "rainMm", 0.0
        );

        DiseaseRiskDTO risk = weatherService.calculateDiseaseRisk(farm, forecast);

        assertThat(risk.crop()).isEqualTo("Rice");
        assertThat(risk.riskLevel()).isEqualTo("LOW");
        assertThat(risk.diseases()).isNotEmpty();
        assertThat(risk.diseases()).allMatch(d -> d.matchedThresholds() == 0);
    }

    @Test
    void defaultsToRiceWhenFarmHasNoFields() {
        Farm farm = new Farm("New Farm Without Fields", "anita_das", "Nadia");

        Map<String, Object> forecast = Map.of(
                "temperatureC", 27.0,
                "humidityPercent", 88.0,
                "rainMm", 6.0
        );

        DiseaseRiskDTO risk = weatherService.calculateDiseaseRisk(farm, forecast);

        assertThat(risk.crop()).isEqualTo("Rice");
        assertThat(risk.riskLevel()).isEqualTo("HIGH");
        assertThat(risk.diseases()).isNotEmpty();
    }

    @Test
    void handlesUnknownCropGracefullyWithLowRisk() {
        Farm farm = new Farm("Dragon Fruit Farm", "rahul_sen", "Bankura");
        farm.setFields(List.of(new Field("Plot A", "DragonFruit", "Perennial", farm)));

        Map<String, Object> forecast = Map.of(
                "temperatureC", 30.0,
                "humidityPercent", 85.0,
                "rainMm", 10.0
        );

        DiseaseRiskDTO risk = weatherService.calculateDiseaseRisk(farm, forecast);

        assertThat(risk.crop()).isEqualTo("DragonFruit");
        assertThat(risk.riskLevel()).isEqualTo("LOW");
        assertThat(risk.diseases()).isEmpty();
    }
}
