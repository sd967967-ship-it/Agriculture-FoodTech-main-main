package com.example.repository;

import com.example.entity.AlertMessage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AlertMessageRepository extends JpaRepository<AlertMessage, Long> {
    List<AlertMessage> findByFarmerUsernameOrderByCreatedAtDesc(String farmerUsername);
}
