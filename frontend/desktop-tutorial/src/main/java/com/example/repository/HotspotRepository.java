package com.example.repository;

import com.example.entity.Hotspot;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HotspotRepository extends JpaRepository<Hotspot, Long> {
}
