package com.example.entity;

import jakarta.persistence.*;

import java.time.Instant;

@Entity
public class Referral {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String farmerUsername;

    @Column(nullable = false)
    private String crop;

    @Column(nullable = false)
    private String sampleId;

    @Column(nullable = false)
    private String status;

    @Column(length = 2000)
    private String result;

    @Column(nullable = false)
    private Instant createdAt;

    protected Referral() {}

    public Referral(String farmerUsername, String crop, String sampleId, String status) {
        this.farmerUsername = farmerUsername;
        this.crop = crop;
        this.sampleId = sampleId;
        this.status = status;
        this.createdAt = Instant.now();
    }

    public Long getId() { return id; }
    public String getFarmerUsername() { return farmerUsername; }
    public String getCrop() { return crop; }
    public String getSampleId() { return sampleId; }
    public String getStatus() { return status; }
    public String getResult() { return result; }
    public Instant getCreatedAt() { return createdAt; }

    public void setStatus(String status) { this.status = status; }
    public void setResult(String result) { this.result = result; }
}
