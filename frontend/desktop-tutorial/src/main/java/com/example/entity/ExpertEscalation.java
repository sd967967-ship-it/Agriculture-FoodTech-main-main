package com.example.entity;

import jakarta.persistence.*;

import java.time.Instant;

@Entity
public class ExpertEscalation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String farmerUsername;

    @Column(nullable = false)
    private String status;

    @Column(nullable = false)
    private String assignedExpert;

    @Column(length = 2000)
    private String notes;

    @Column(nullable = false)
    private Instant createdAt;

    protected ExpertEscalation() {}

    public ExpertEscalation(String farmerUsername, String status, String assignedExpert, String notes) {
        this.farmerUsername = farmerUsername;
        this.status = status;
        this.assignedExpert = assignedExpert;
        this.notes = notes;
        this.createdAt = Instant.now();
    }

    public Long getId() { return id; }
    public String getFarmerUsername() { return farmerUsername; }
    public String getStatus() { return status; }
    public String getAssignedExpert() { return assignedExpert; }
    public String getNotes() { return notes; }
    public Instant getCreatedAt() { return createdAt; }
}
