package com.example.repository;

import com.example.entity.UserQuery;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserQueryRepository extends JpaRepository<UserQuery, Long> {
}
