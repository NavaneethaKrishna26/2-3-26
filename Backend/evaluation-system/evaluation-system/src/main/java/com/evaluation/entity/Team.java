package com.evaluation.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.List;

@Entity
@Table(name = "teams")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Team {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long teamId;

    @Column(unique = true, nullable = false)
    private String teamName;

    private Double overallScore = 0.0;

    // PENDING or EVALUATED
    private String evaluationStatus = "PENDING";

    private Boolean locked = false;

    // One team has many students
    @OneToMany(mappedBy = "team", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Student> members;
}
