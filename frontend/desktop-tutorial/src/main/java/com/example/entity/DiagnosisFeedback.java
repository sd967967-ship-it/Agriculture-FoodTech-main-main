package com.example.entity;

import jakarta.persistence.*;

import java.time.Instant;

@Entity
public class DiagnosisFeedback {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String farmerUsername;

    @Column(nullable = false)
    private String diagnosis;

    @Column(nullable = false)
    private String label;

    @Column(nullable = false)
    private String modelVersion;

    @Column(nullable = false)
    private Instant createdAt;

    protected DiagnosisFeedback() {}

    public DiagnosisFeedback(String farmerUsername, String diagnosis, String label, String modelVersion) {
        this.farmerUsername = farmerUsername;
        this.diagnosis = diagnosis;
        this.label = label;
        this.modelVersion = modelVersion;
        this.createdAt = Instant.now();
    }

    public Long getId() { return id; }
    public String getFarmerUsername() { return farmerUsername; }
    public String getDiagnosis() { return diagnosis; }
    public String getLabel() { return label; }
    public String getModelVersion() { return modelVersion; }
    public Instant getCreatedAt() { return createdAt; }
}
