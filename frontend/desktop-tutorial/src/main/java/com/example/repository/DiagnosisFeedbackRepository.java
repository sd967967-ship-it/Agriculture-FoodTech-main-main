package com.example.repository;

import com.example.entity.DiagnosisFeedback;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DiagnosisFeedbackRepository extends JpaRepository<DiagnosisFeedback, Long> {
    List<DiagnosisFeedback> findByFarmerUsernameOrderByCreatedAtDesc(String farmerUsername);
}
