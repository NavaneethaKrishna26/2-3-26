package com.evaluation.repository;

import com.evaluation.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface StudentRepository extends JpaRepository<Student, Long> {
    boolean existsByRollNumber(String rollNumber);
    List<Student> findByTeamTeamId(Long teamId);
}
