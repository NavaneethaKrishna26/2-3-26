package com.evaluation.dto;
import lombok.Data; import lombok.AllArgsConstructor; import lombok.NoArgsConstructor;
@Data @AllArgsConstructor @NoArgsConstructor
public class StudentResponse {
    private Long studentId; private String name; private String rollNumber; private String role;
    private Integer communication; private Integer technical; private Integer innovation;
    private Integer collaboration; private Integer presentation;
    private Integer totalScore; private Boolean evaluated;
}
