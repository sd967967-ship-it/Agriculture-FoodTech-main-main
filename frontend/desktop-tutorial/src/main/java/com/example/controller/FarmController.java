package com.example.controller;

import com.example.dto.DiseaseRiskDTO;
import com.example.entity.Farm;
import com.example.repository.FarmRepository;
import com.example.service.WBCropKnowledgeBase;
import com.example.service.WeatherService;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping({"/api/v1", "/api"})
@CrossOrigin(origins = "*")
public class FarmController {

    private final FarmRepository farmRepository;
    private final WeatherService weatherService;
    private final WBCropKnowledgeBase knowledgeBase;

    public FarmController(FarmRepository farmRepository,
                          WeatherService weatherService,
                          WBCropKnowledgeBase knowledgeBase) {
        this.farmRepository = farmRepository;
        this.weatherService = weatherService;
        this.knowledgeBase = knowledgeBase;
    }

    @GetMapping("/farms")
    public List<Map<String, Object>> getFarms(@RequestParam(value = "farmerUsername", required = false) String farmerUsername) {
        List<Farm> farms = (farmerUsername == null || farmerUsername.isBlank())
                ? farmRepository.findAll()
                : farmRepository.findByFarmerUsernameOrderByIdDesc(farmerUsername);
        return farms.stream().map(this::toMap).toList();
    }

    @PostMapping("/farms")
    public ResponseEntity<Map<String, Object>> createFarm(@RequestBody Map<String, String> payload) {
        String name = payload.getOrDefault("name", "").trim();
        String farmerUsername = payload.getOrDefault("farmerUsername", "").trim();
        String district = payload.getOrDefault("district", "").trim();

        if (name.isBlank() || farmerUsername.isBlank() || district.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "VALIDATION_ERROR", "message", "Farm name, farmer username and district are required."));
        }

        Farm farm = farmRepository.save(new Farm(name, farmerUsername, district));
        return ResponseEntity.ok(toMap(farm));
    }

    @Transactional(readOnly = true)
    @GetMapping("/farms/{id}/risk-forecast")
    public ResponseEntity<DiseaseRiskDTO> getDiseaseRiskForecast(@PathVariable("id") Long id) {
        return farmRepository.findById(id)
                .map(farm -> {
                    Double lat = null;
                    Double lon = null;
                    if (farm.getDistrict() != null) {
                        WBCropKnowledgeBase.DistrictInfo district = knowledgeBase.getDistrict(farm.getDistrict());
                        if (district != null) {
                            lat = district.latitude();
                            lon = district.longitude();
                        }
                    }
                    Map<String, Object> forecast = weatherService.getLiveWeather(lat, lon);
                    DiseaseRiskDTO risk = weatherService.calculateDiseaseRisk(farm, forecast);
                    return ResponseEntity.ok(risk);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    private Map<String, Object> toMap(Farm farm) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", farm.getId());
        map.put("name", farm.getName());
        map.put("farmerUsername", farm.getFarmerUsername());
        map.put("district", farm.getDistrict());
        map.put("fieldCount", farm.getFields() != null ? farm.getFields().size() : 0);
        return map;
    }
}
