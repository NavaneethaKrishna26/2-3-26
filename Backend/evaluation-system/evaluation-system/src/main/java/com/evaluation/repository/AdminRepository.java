package com.evaluation.repository;

import com.evaluation.entity.Admin;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

// Spring Data JPA automatically provides save, findById, findAll, delete methods
public interface AdminRepository extends JpaRepository<Admin, Long> {
    Optional<Admin> findByEmail(String email);
    boolean existsByEmail(String email);
}
