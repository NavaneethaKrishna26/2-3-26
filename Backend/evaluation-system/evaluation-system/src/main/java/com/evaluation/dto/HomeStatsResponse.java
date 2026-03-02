package com.evaluation.dto;
import lombok.Data; import lombok.AllArgsConstructor; import lombok.NoArgsConstructor;
@Data @AllArgsConstructor @NoArgsConstructor
public class HomeStatsResponse { private long totalTeams; private long evaluatedTeams; private long pendingTeams; }
