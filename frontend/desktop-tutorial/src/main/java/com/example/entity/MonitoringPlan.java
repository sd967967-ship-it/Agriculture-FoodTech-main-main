package com.example.entity;

import jakarta.persistence.*;

import java.time.Instant;

@Entity
public class MonitoringPlan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String farmerUsername;

    @Column(nullable = false)
    private String crop;

    @Column(nullable = false)
    private Integer intervalDays;

    @Column(nullable = false)
    private Instant createdAt;

    protected MonitoringPlan() {}

    public MonitoringPlan(String farmerUsername, String crop, Integer intervalDays) {
        this.farmerUsername = farmerUsername;
        this.crop = crop;
        this.intervalDays = intervalDays;
        this.createdAt = Instant.now();
    }

    public Long getId() { return id; }
    public String getFarmerUsername() { return farmerUsername; }
    public String getCrop() { return crop; }
    public Integer getIntervalDays() { return intervalDays; }
    public Instant getCreatedAt() { return createdAt; }
}
