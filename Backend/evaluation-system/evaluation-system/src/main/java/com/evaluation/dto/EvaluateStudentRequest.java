package com.evaluation.dto;

import lombok.Data;

// This is the request body for PUT /api/admin/students/{studentId}/evaluate
@Data
public class EvaluateStudentRequest {
    private Integer communication;
    private Integer technical;
    private Integer innovation;
    private Integer collaboration;
    private Integer presentation;
}
