package com.example.entity;

import jakarta.persistence.*;

import java.time.Instant;

@Entity
public class Hotspot {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String district;

    @Column(nullable = false)
    private String village;

    @Column(nullable = false)
    private String riskLevel;

    @Column(nullable = false)
    private int caseCount;

    @Column(nullable = false)
    private Instant createdAt;

    protected Hotspot() {}

    public Hotspot(String district, String village, String riskLevel, int caseCount) {
        this.district = district;
        this.village = village;
        this.riskLevel = riskLevel;
        this.caseCount = caseCount;
        this.createdAt = Instant.now();
    }

    public Long getId() { return id; }
    public String getDistrict() { return district; }
    public String getVillage() { return village; }
    public String getRiskLevel() { return riskLevel; }
    public int getCaseCount() { return caseCount; }
    public Instant getCreatedAt() { return createdAt; }
}
