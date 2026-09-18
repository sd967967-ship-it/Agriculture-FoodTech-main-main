package com.example.repository;

import com.example.entity.FollowUpTask;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FollowUpTaskRepository extends JpaRepository<FollowUpTask, Long> {
    List<FollowUpTask> findByStatusOrderByDueDateAsc(String status);
    List<FollowUpTask> findByFarmIdOrderByDueDateAsc(Long farmId);
    List<FollowUpTask> findByFarmIdAndStatusOrderByDueDateAsc(Long farmId, String status);
    List<FollowUpTask> findAllByOrderByDueDateAsc();
}
