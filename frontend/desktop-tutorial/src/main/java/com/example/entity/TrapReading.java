package com.example.entity;

import jakarta.persistence.*;

import java.time.Instant;

@Entity
public class TrapReading {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String farmerUsername;

    @Column(nullable = false)
    private String trapType;

    @Column(nullable = false)
    private int count;

    @Column(nullable = false)
    private Instant createdAt;

    protected TrapReading() {}

    public TrapReading(String farmerUsername, String trapType, int count) {
        this.farmerUsername = farmerUsername;
        this.trapType = trapType;
        this.count = count;
        this.createdAt = Instant.now();
    }

    public Long getId() { return id; }
    public String getFarmerUsername() { return farmerUsername; }
    public String getTrapType() { return trapType; }
    public int getCount() { return count; }
    public Instant getCreatedAt() { return createdAt; }
}
