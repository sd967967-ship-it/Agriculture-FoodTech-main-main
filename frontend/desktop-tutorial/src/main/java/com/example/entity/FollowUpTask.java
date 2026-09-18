package com.example.entity;

import jakarta.persistence.*;

import java.time.Instant;
import java.time.LocalDate;

@Entity
public class FollowUpTask {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long farmId;

    @Column(nullable = false)
    private Long diagnosisId;

    @Column(nullable = false)
    private LocalDate dueDate;

    @Column(nullable = false)
    private String status; // "PENDING", "COMPLETED", etc.

    @Column(length = 500)
    private String taskTitle;

    @Column(nullable = false)
    private Instant createdAt;

    protected FollowUpTask() {}

    public FollowUpTask(Long farmId, Long diagnosisId, LocalDate dueDate, String status, String taskTitle) {
        this.farmId = farmId;
        this.diagnosisId = diagnosisId;
        this.dueDate = dueDate != null ? dueDate : LocalDate.now().plusDays(7);
        this.status = status != null ? status.trim().toUpperCase() : "PENDING";
        this.taskTitle = taskTitle;
        this.createdAt = Instant.now();
    }

    public FollowUpTask(Long farmId, Long diagnosisId, LocalDate dueDate, String status) {
        this(farmId, diagnosisId, dueDate, status, null);
    }

    public Long getId() {
        return id;
    }

    public Long getFarmId() {
        return farmId;
    }

    public void setFarmId(Long farmId) {
        this.farmId = farmId;
    }

    public Long getDiagnosisId() {
        return diagnosisId;
    }

    public void setDiagnosisId(Long diagnosisId) {
        this.diagnosisId = diagnosisId;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status != null ? status.trim().toUpperCase() : "PENDING";
    }

    public String getTaskTitle() {
        return taskTitle;
    }

    public void setTaskTitle(String taskTitle) {
        this.taskTitle = taskTitle;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
