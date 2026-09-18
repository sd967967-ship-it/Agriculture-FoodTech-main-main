package com.example.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import java.time.Instant;

@Entity
public class UserQuery {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 2000)
    private String question;

    @Column(nullable = false)
    private String username;

    @Column(length = 120)
    private String crop;

    @Column(length = 120)
    private String district;

    @Column(nullable = false, length = 10)
    private String language;

    @Column(nullable = false, length = 30)
    private String status;

    @Column(length = 40)
    private String provider;

    @Column(nullable = false)
    private Instant createdAt;

    protected UserQuery() {}

    public UserQuery(String question, String username, String crop, String district,
                     String language, String status, String provider) {
        this.question = question;
        this.username = username;
        this.crop = crop;
        this.district = district;
        this.language = language;
        this.status = status;
        this.provider = provider;
        this.createdAt = Instant.now();
    }

    public Long getId() { return id; }
    public String getQuestion() { return question; }
    public String getUsername() { return username; }
    public String getCrop() { return crop; }
    public String getDistrict() { return district; }
    public String getLanguage() { return language; }
    public String getStatus() { return status; }
    public String getProvider() { return provider; }
    public Instant getCreatedAt() { return createdAt; }
}
