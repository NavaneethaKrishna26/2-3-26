package com.evaluation.dto;
import lombok.Data; import lombok.AllArgsConstructor; import lombok.NoArgsConstructor;
@Data @AllArgsConstructor @NoArgsConstructor
public class TeamSummaryResponse { private Long teamId; private String teamName; private Double overallScore; private String evaluationStatus; }
