package com.example.controller;

import com.example.entity.FollowUpTask;
import com.example.repository.FollowUpTaskRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping({"/api/v1", "/api"})
@CrossOrigin(origins = "*")
public class FollowUpTaskController {

    private final FollowUpTaskRepository repository;

    public FollowUpTaskController(FollowUpTaskRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/follow-ups")
    public List<Map<String, Object>> getFollowUps(
            @RequestParam(value = "farmId", required = false) Long farmId,
            @RequestParam(value = "status", required = false) String status) {

        List<FollowUpTask> tasks;
        String normalizedStatus = (status != null && !status.isBlank()) ? status.trim().toUpperCase() : null;

        if (farmId != null && normalizedStatus != null) {
            tasks = repository.findByFarmIdAndStatusOrderByDueDateAsc(farmId, normalizedStatus);
        } else if (farmId != null) {
            tasks = repository.findByFarmIdOrderByDueDateAsc(farmId);
        } else if (normalizedStatus != null) {
            tasks = repository.findByStatusOrderByDueDateAsc(normalizedStatus);
        } else {
            tasks = repository.findAllByOrderByDueDateAsc();
        }

        return tasks.stream().map(this::toMap).toList();
    }

    @PostMapping("/follow-ups")
    public ResponseEntity<?> createFollowUp(@RequestBody Map<String, Object> payload) {
        Object farmIdObj = payload.get("farmId");
        Object diagnosisIdObj = payload.get("diagnosisId");

        if (farmIdObj == null || diagnosisIdObj == null) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "VALIDATION_ERROR",
                    "message", "farmId and diagnosisId are required."
            ));
        }

        Long farmId;
        Long diagnosisId;
        try {
            farmId = Long.parseLong(farmIdObj.toString());
            diagnosisId = Long.parseLong(diagnosisIdObj.toString());
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", "VALIDATION_ERROR",
                    "message", "farmId and diagnosisId must be valid numbers."
            ));
        }

        LocalDate dueDate = LocalDate.now().plusDays(7);
        Object dueDateObj = payload.get("dueDate");
        if (dueDateObj != null && !dueDateObj.toString().isBlank()) {
            try {
                dueDate = LocalDate.parse(dueDateObj.toString().trim().substring(0, Math.min(10, dueDateObj.toString().trim().length())));
            } catch (DateTimeParseException e) {
                return ResponseEntity.badRequest().body(Map.of(
                        "error", "VALIDATION_ERROR",
                        "message", "dueDate must be a valid date in YYYY-MM-DD format."
                ));
            }
        }

        String status = payload.get("status") != null ? payload.get("status").toString().trim().toUpperCase() : "PENDING";
        if (status.isEmpty()) {
            status = "PENDING";
        }

        String taskTitle = payload.get("taskTitle") != null ? payload.get("taskTitle").toString().trim() : null;
        if (taskTitle == null || taskTitle.isBlank()) {
            taskTitle = "7-Day Follow-Up: Inspect field recovery after treatment application.";
        }

        FollowUpTask task = new FollowUpTask(farmId, diagnosisId, dueDate, status, taskTitle);
        FollowUpTask saved = repository.save(task);
        return ResponseEntity.ok(toMap(saved));
    }

    @PostMapping("/follow-ups/{id}/complete")
    public ResponseEntity<?> completeFollowUpPost(@PathVariable("id") long id) {
        return markComplete(id);
    }

    @PatchMapping("/follow-ups/{id}/complete")
    public ResponseEntity<?> completeFollowUpPatch(@PathVariable("id") long id) {
        return markComplete(id);
    }

    @PatchMapping("/follow-ups/{id}")
    public ResponseEntity<?> updateFollowUp(@PathVariable("id") long id, @RequestBody(required = false) Map<String, Object> payload) {
        String newStatus = payload != null && payload.get("status") != null
                ? payload.get("status").toString().trim().toUpperCase()
                : "COMPLETED";
        return repository.findById(id)
                .map(task -> {
                    task.setStatus(newStatus);
                    FollowUpTask updated = repository.save(task);
                    return ResponseEntity.ok(toMap(updated));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    private ResponseEntity<?> markComplete(long id) {
        return repository.findById(id)
                .map(task -> {
                    task.setStatus("COMPLETED");
                    FollowUpTask updated = repository.save(task);
                    return ResponseEntity.ok(toMap(updated));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    private Map<String, Object> toMap(FollowUpTask task) {
        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", task.getId());
        map.put("farmId", task.getFarmId());
        map.put("diagnosisId", task.getDiagnosisId());
        map.put("dueDate", task.getDueDate().toString());
        map.put("status", task.getStatus());
        map.put("taskTitle", task.getTaskTitle());
        map.put("createdAt", task.getCreatedAt().toString());
        return map;
    }
}
