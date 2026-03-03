package com.evaluation.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class MemberRequest {
    @NotBlank
    public String name;

    @NotBlank
    public String rollNumber;

    public String role;
}
