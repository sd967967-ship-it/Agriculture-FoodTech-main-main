package com.example.entity;

import jakarta.persistence.*;

import java.time.Instant;

@Entity
public class PestObservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long farmId;

    @Column(nullable = false)
    private String pestType;

    @Column(nullable = false)
    private int count;

    @Column(nullable = false)
    private String source; // "manual" or "sensor"

    @Column(nullable = false)
    private Instant timestamp;

    protected PestObservation() {}

    public PestObservation(Long farmId, String pestType, int count, String source, Instant timestamp) {
        this.farmId = farmId;
        this.pestType = pestType;
        this.count = count;
        this.source = source != null ? source.trim().toLowerCase() : "manual";
        this.timestamp = timestamp != null ? timestamp : Instant.now();
    }

    public PestObservation(Long farmId, String pestType, int count, String source) {
        this(farmId, pestType, count, source, Instant.now());
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

    public String getPestType() {
        return pestType;
    }

    public void setPestType(String pestType) {
        this.pestType = pestType;
    }

    public int getCount() {
        return count;
    }

    public void setCount(int count) {
        this.count = count;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source != null ? source.trim().toLowerCase() : "manual";
    }

    public Instant getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Instant timestamp) {
        this.timestamp = timestamp != null ? timestamp : Instant.now();
    }
}
