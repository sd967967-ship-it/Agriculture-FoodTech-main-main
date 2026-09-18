package com.example.entity;

import jakarta.persistence.*;

import java.time.Instant;

@Entity
public class AlertMessage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String farmerUsername;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, length = 1000)
    private String message;

    @Column(nullable = false)
    private String level;

    @Column(nullable = false)
    private Instant createdAt;

    protected AlertMessage() {}

    public AlertMessage(String farmerUsername, String title, String message, String level) {
        this.farmerUsername = farmerUsername;
        this.title = title;
        this.message = message;
        this.level = level;
        this.createdAt = Instant.now();
    }

    public Long getId() { return id; }
    public String getFarmerUsername() { return farmerUsername; }
    public String getTitle() { return title; }
    public String getMessage() { return message; }
    public String getLevel() { return level; }
    public Instant getCreatedAt() { return createdAt; }
}
