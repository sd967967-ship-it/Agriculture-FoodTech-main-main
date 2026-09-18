package com.example.entity;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
public class Farm {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String farmerUsername;

    @Column(nullable = false)
    private String district;

    @OneToMany(mappedBy = "farm", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Field> fields = new ArrayList<>();

    protected Farm() {}

    public Farm(String name, String farmerUsername, String district) {
        this.name = name;
        this.farmerUsername = farmerUsername;
        this.district = district;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getFarmerUsername() { return farmerUsername; }
    public void setFarmerUsername(String farmerUsername) { this.farmerUsername = farmerUsername; }
    public String getDistrict() { return district; }
    public void setDistrict(String district) { this.district = district; }
    public List<Field> getFields() { return fields; }
    public void setFields(List<Field> fields) { this.fields = fields; }
}
