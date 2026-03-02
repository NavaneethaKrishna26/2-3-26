package com.evaluation.service;

import com.evaluation.dto.AdminLoginRequest;
import com.evaluation.dto.AdminSignupRequest;
import com.evaluation.model.Admin;
import com.evaluation.repository.AdminRepository;
import com.evaluation.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class AuthService {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    // Register a new admin
    public Map<String, String> signup(AdminSignupRequest request) {
        // Check if email already exists
        if (adminRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        // Create new admin
        Admin admin = new Admin();
        admin.setName(request.getName());
        admin.setEmail(request.getEmail());
        admin.setPassword(passwordEncoder.encode(request.getPassword())); // hash the password

        adminRepository.save(admin);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Admin registered successfully");
        return response;
    }

    // Login admin and return JWT token
    public Map<String, String> login(AdminLoginRequest request) {
        // Find admin by email
        Admin admin = adminRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        // Check if password matches
        if (!passwordEncoder.matches(request.getPassword(), admin.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        // Generate JWT token
        String token = jwtUtil.generateToken(admin.getEmail());

        Map<String, String> response = new HashMap<>();
        response.put("token", token);
        response.put("role", admin.getRole());
        return response;
    }
}
