package com.example.repository;

import com.example.entity.PestObservation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PestObservationRepository extends JpaRepository<PestObservation, Long> {
    List<PestObservation> findByFarmIdOrderByTimestampDesc(Long farmId);
    List<PestObservation> findAllByOrderByTimestampDesc();
}
