package com.example.repository;

import com.example.entity.MonitoringPlan;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MonitoringPlanRepository extends JpaRepository<MonitoringPlan, Long> {
    List<MonitoringPlan> findByFarmerUsernameOrderByCreatedAtDesc(String farmerUsername);
}
