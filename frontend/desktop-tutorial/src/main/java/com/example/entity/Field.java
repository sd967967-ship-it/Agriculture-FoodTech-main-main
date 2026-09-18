package com.example.entity;

import jakarta.persistence.*;

@Entity
public class Field {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String crop;

    @Column(nullable = false)
    private String season;

    @ManyToOne
    @JoinColumn(name = "farm_id")
    private Farm farm;

    protected Field() {}

    public Field(String name, String crop, String season, Farm farm) {
        this.name = name;
        this.crop = crop;
        this.season = season;
        this.farm = farm;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getCrop() { return crop; }
    public void setCrop(String crop) { this.crop = crop; }
    public String getSeason() { return season; }
    public void setSeason(String season) { this.season = season; }
    public Farm getFarm() { return farm; }
    public void setFarm(Farm farm) { this.farm = farm; }
}
