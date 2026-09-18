package com.example.service;

import org.springframework.stereotype.Service;

@Service
public class WeatherRiskService {

    public record RiskAssessment(String level, String recommendation) {
    }

    public RiskAssessment assessRisk(double temperatureC, double humidityPercent, double rainMm, double windKph) {
        if (temperatureC >= 30.0 && humidityPercent >= 80.0 && rainMm >= 8.0) {
            return new RiskAssessment("HIGH", "High disease pressure likely. Increase monitoring and avoid unnecessary spraying before the next rain window.");
        }
        if (humidityPercent >= 75.0 || rainMm >= 5.0 || windKph >= 15.0) {
            return new RiskAssessment("MEDIUM", "Moderate risk. Keep field monitoring active and review the crop canopy for signs of disease.");
        }
        return new RiskAssessment("LOW", "Conditions are relatively normal. Continue routine care and maintain the standard monitoring pattern.");
    }
}
