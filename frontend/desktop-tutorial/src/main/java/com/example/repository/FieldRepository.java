package com.example.repository;

import com.example.entity.Field;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FieldRepository extends JpaRepository<Field, Long> {
    List<Field> findByFarmIdOrderByIdAsc(Long farmId);
}
