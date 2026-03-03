package com.evaluation.controller;

import com.evaluation.dto.EvaluateStudentRequest;
import com.evaluation.entity.Student;
import com.evaluation.service.StudentService;
import com.evaluation.service.TeamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

// All endpoints here require ADMIN role (JWT token)
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private TeamService teamService;

    @Autowired
    private StudentService studentService;

    // GET /api/admin/teams  — Get all teams list
    @GetMapping("/teams")
    public ResponseEntity<?> getAllTeams() {
        return ResponseEntity.ok(teamService.getAllTeams());
    }

    // GET /api/admin/teams/{teamId}  — Get single team with full details
    @GetMapping("/teams/{teamId}")
    public ResponseEntity<?> getTeam(@PathVariable Long teamId) {
        try {
            return ResponseEntity.ok(teamService.getTeamById(teamId));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // PUT /api/admin/teams/{teamId}/lock  — Lock a team
    @PutMapping("/teams/{teamId}/lock")
    public ResponseEntity<?> lockTeam(@PathVariable Long teamId) {
        try {
            Map<String, String> response = teamService.lockTeam(teamId);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // PUT /api/admin/students/{studentId}/evaluate  — Submit marks for a student
    @PutMapping("/students/{studentId}/evaluate")
    public ResponseEntity<?> evaluateStudent(
            @PathVariable Long studentId,
            @RequestBody EvaluateStudentRequest request) {
        try {
            Map<String, Object> response = studentService.evaluateStudent(studentId, request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // GET /api/admin/students/{studentId}  — Get student evaluation details
    @GetMapping("/students/{studentId}")
    public ResponseEntity<?> getStudent(@PathVariable Long studentId) {
        try {
            Student student = studentService.getStudentById(studentId);
            return ResponseEntity.ok(student);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

}
