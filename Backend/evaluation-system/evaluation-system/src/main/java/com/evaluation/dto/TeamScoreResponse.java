package com.evaluation.dto;
import lombok.Data; import lombok.AllArgsConstructor; import lombok.NoArgsConstructor;
import java.util.List;
@Data @AllArgsConstructor @NoArgsConstructor
public class TeamScoreResponse { private String teamName; private Double overallScore; private List<MemberScoreResponse> members; }
