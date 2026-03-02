package com.evaluation.repository;

import com.evaluation.entity.Team;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface TeamRepository extends JpaRepository<Team, Long> {
    // Get all teams sorted by overallScore descending (for leaderboard)
    List<Team> findAllByOrderByOverallScoreDesc();

    // Count teams by evaluation status
    long countByEvaluationStatus(String status);
}
