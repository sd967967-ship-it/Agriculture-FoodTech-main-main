package com.example.repository;

import com.example.entity.Farm;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FarmRepository extends JpaRepository<Farm, Long> {
    List<Farm> findByFarmerUsernameOrderByIdDesc(String farmerUsername);
}
