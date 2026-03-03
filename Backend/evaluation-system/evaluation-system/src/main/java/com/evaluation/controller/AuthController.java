package com.evaluation.controller;

import com.evaluation.dto.AdminLoginRequest;
import com.evaluation.dto.AdminSignupRequest;
import com.evaluation.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin()
public class AuthController {

    @Autowired
    private AuthService authService;

    // POST /api/auth/admin/signup
    @PostMapping("/admin/signup")
    public ResponseEntity<?> signup(@RequestBody AdminSignupRequest request) {
        try {
            Map<String, String> response = authService.signup(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // POST /api/auth/admin/login
    @PostMapping("/admin/login")
    public ResponseEntity<?> login(@RequestBody AdminLoginRequest request) {
        try {
            Map<String, String> response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
