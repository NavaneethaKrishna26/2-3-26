package com.evaluation.dto;
import lombok.Data; import lombok.AllArgsConstructor; import lombok.NoArgsConstructor;
import java.util.List;
@Data @AllArgsConstructor @NoArgsConstructor
public class TeamDetailsResponse {
    private Long teamId; private String teamName; private Double overallScore;
    private String evaluationStatus; private Boolean locked; private List<StudentResponse> members;
}
