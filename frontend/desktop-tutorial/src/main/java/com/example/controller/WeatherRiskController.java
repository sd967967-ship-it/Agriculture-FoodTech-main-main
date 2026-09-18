package com.example.controller;

import com.example.service.WeatherRiskService;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
@CrossOrigin(origins = "*")
public class WeatherRiskController {

    private final WeatherRiskService weatherRiskService;

    public WeatherRiskController(WeatherRiskService weatherRiskService) {
        this.weatherRiskService = weatherRiskService;
    }

    @GetMapping("/weather-risk")
    public Map<String, Object> getRisk(
            @RequestParam(value = "temperatureC", required = false, defaultValue = "28") double temperatureC,
            @RequestParam(value = "humidityPercent", required = false, defaultValue = "70") double humidityPercent,
            @RequestParam(value = "rainMm", required = false, defaultValue = "3") double rainMm,
            @RequestParam(value = "windKph", required = false, defaultValue = "10") double windKph) {

        WeatherRiskService.RiskAssessment assessment = weatherRiskService.assessRisk(temperatureC, humidityPercent, rainMm, windKph);
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("level", assessment.level());
        response.put("recommendation", assessment.recommendation());
        response.put("temperatureC", temperatureC);
        response.put("humidityPercent", humidityPercent);
        response.put("rainMm", rainMm);
        response.put("windKph", windKph);
        return response;
    }
}
