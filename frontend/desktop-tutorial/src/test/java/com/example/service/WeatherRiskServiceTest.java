package com.example.service;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class WeatherRiskServiceTest {

    @Test
    void marksHighHumidityAndRainAsHighRisk() {
        WeatherRiskService service = new WeatherRiskService();

        WeatherRiskService.RiskAssessment risk = service.assessRisk(30.0, 85.0, 12.5, 18.0);

        assertThat(risk.level()).isEqualTo("HIGH");
        assertThat(risk.recommendation()).contains("monitor").contains("avoid");
    }

    @Test
    void keepsMildConditionsAtLowRisk() {
        WeatherRiskService service = new WeatherRiskService();

        WeatherRiskService.RiskAssessment risk = service.assessRisk(27.0, 58.0, 1.1, 8.0);

        assertThat(risk.level()).isEqualTo("LOW");
        assertThat(risk.recommendation()).contains("normal");
    }
}
