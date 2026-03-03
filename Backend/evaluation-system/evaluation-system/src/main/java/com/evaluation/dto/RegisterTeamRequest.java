package com.evaluation.dto;

import lombok.Data;
import java.util.List;

// This is the request body for POST /api/teams/register
@Data
public class RegisterTeamRequest {
    private String teamName;
    private List<MemberRequest> members;

    @Data
    public static class MemberRequest {
        private String name;
        private String rollNumber;
        private String role;
    }
}
