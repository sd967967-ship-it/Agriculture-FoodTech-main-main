package com.example.controller;

import com.example.entity.Farm;
import com.example.entity.Field;
import com.example.repository.FarmRepository;
import com.example.repository.FieldRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
@CrossOrigin(origins = "*")
public class FieldController {

    private final FieldRepository fieldRepository;
    private final FarmRepository farmRepository;

    public FieldController(FieldRepository fieldRepository, FarmRepository farmRepository) {
        this.fieldRepository = fieldRepository;
        this.farmRepository = farmRepository;
    }

    @GetMapping("/farms/{farmId}/fields")
    public List<Map<String, Object>> getFields(@PathVariable("farmId") Long farmId) {
        return fieldRepository.findByFarmIdOrderByIdAsc(farmId).stream().map(this::toMap).toList();
    }

    @PostMapping("/fields")
    public ResponseEntity<Map<String, Object>> createField(@RequestBody Map<String, Object> payload) {
        Object farmIdValue = payload.get("farmId");
        String name = String.valueOf(payload.getOrDefault("name", "")).trim();
        String crop = String.valueOf(payload.getOrDefault("crop", "")).trim();
        String season = String.valueOf(payload.getOrDefault("season", "")).trim();

        if (farmIdValue == null || name.isBlank() || crop.isBlank() || season.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "VALIDATION_ERROR", "message", "farmId, name, crop and season are required."));
        }

        Long farmId = Long.parseLong(farmIdValue.toString());
        Farm farm = farmRepository.findById(farmId)
                .orElseThrow(() -> new IllegalArgumentException("Farm not found: " + farmId));

        Field field = fieldRepository.save(new Field(name, crop, season, farm));
        return ResponseEntity.ok(toMap(field));
    }

    private Map<String, Object> toMap(Field field) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", field.getId());
        map.put("name", field.getName());
        map.put("crop", field.getCrop());
        map.put("season", field.getSeason());
        map.put("farmId", field.getFarm() != null ? field.getFarm().getId() : null);
        return map;
    }
}
