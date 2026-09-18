package com.example.entity;

import jakarta.persistence.*;

import java.time.Instant;

@Entity
public class GovernanceConsent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String farmerUsername;

    @Column(nullable = false)
    private String consentType;

    @Column(nullable = false)
    private boolean granted;

    @Column(nullable = false)
    private Instant createdAt;

    protected GovernanceConsent() {}

    public GovernanceConsent(String farmerUsername, String consentType, boolean granted) {
        this.farmerUsername = farmerUsername;
        this.consentType = consentType;
        this.granted = granted;
        this.createdAt = Instant.now();
    }

    public Long getId() { return id; }
    public String getFarmerUsername() { return farmerUsername; }
    public String getConsentType() { return consentType; }
    public boolean isGranted() { return granted; }
    public Instant getCreatedAt() { return createdAt; }
}
