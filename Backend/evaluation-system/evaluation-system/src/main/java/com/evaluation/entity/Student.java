package com.evaluation.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "students")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long studentId;

    private String name;

    @Column(unique = true, nullable = false)
    private String rollNumber;

    private String role; // e.g. "Backend", "Frontend"

    // Marks (null means not yet evaluated)
    private Integer communication;
    private Integer technical;
    private Integer innovation;
    private Integer collaboration;
    private Integer presentation;

    // Sum of all marks
    private Integer totalScore = 0;

    // Whether this student has been evaluated
    private Boolean evaluated = false;

    // Many students belong to one team
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "team_id")
    private Team team;
}
