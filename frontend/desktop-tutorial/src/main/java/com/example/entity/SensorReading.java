package com.example.entity;

import jakarta.persistence.*;

import java.time.Instant;

@Entity
public class SensorReading {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String farmerUsername;

    @Column(nullable = false)
    private String sensorType;

    @Column(name = "sensor_value", nullable = false)
    private double value;

    @Column(nullable = false)
    private Instant createdAt;

    protected SensorReading() {}

    public SensorReading(String farmerUsername, String sensorType, double value) {
        this.farmerUsername = farmerUsername;
        this.sensorType = sensorType;
        this.value = value;
        this.createdAt = Instant.now();
    }

    public Long getId() { return id; }
    public String getFarmerUsername() { return farmerUsername; }
    public String getSensorType() { return sensorType; }
    public double getValue() { return value; }
    public Instant getCreatedAt() { return createdAt; }
}
