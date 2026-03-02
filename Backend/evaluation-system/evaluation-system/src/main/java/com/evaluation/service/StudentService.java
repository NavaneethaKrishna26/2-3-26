package com.evaluation.service;

import com.evaluation.dto.EvaluateStudentRequest;
import com.evaluation.entity.Student;
import com.evaluation.entity.Team;
import com.evaluation.repository.StudentRepository;
import com.evaluation.repository.TeamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class StudentService {

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private TeamRepository teamRepository;

    // Submit marks for one student
    public Map<String, Object> evaluateStudent(Long studentId, EvaluateStudentRequest request) {
        // Find student
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + studentId));

        // Check if team is locked
        if (student.getTeam().getLocked()) {
            throw new RuntimeException("This team is locked. Marks cannot be changed.");
        }

        // Validate marks are between 0 and 10
        validateMark(request.getCommunication(), "Communication");
        validateMark(request.getTechnical(), "Technical");
        validateMark(request.getInnovation(), "Innovation");
        validateMark(request.getCollaboration(), "Collaboration");
        validateMark(request.getPresentation(), "Presentation");

        // Set marks
        student.setCommunication(request.getCommunication());
        student.setTechnical(request.getTechnical());
        student.setInnovation(request.getInnovation());
        student.setCollaboration(request.getCollaboration());
        student.setPresentation(request.getPresentation());

        // Calculate total score for this student
        int total = request.getCommunication() + request.getTechnical()
                + request.getInnovation() + request.getCollaboration()
                + request.getPresentation();
        student.setTotalScore(total);

        studentRepository.save(student);

        // Recalculate team's overall score
        recalculateTeamScore(student.getTeam().getTeamId());

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Marks submitted successfully");
        response.put("studentId", student.getStudentId());
        response.put("totalScore", student.getTotalScore());
        return response;
    }

    // Recalculate the team's overall average score
    private void recalculateTeamScore(Long teamId) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Team not found with id: " + teamId));
        List<Student> members = studentRepository.findByTeamTeamId(teamId);

        if (members == null || members.isEmpty()) return;

        double totalScore = 0;
        for (Student s : members) {
            totalScore += s.getTotalScore();
        }

        double overallScore = totalScore / members.size();
        team.setOverallScore(overallScore);

        // Check if all students have been evaluated
        boolean allEvaluated = members.stream()
                .allMatch(s -> s.getTotalScore() > 0);
        if (allEvaluated) {
            team.setEvaluationStatus("EVALUATED");
        }

        teamRepository.save(team);
    }

    // Validate mark is between 0 and 10
    private void validateMark(Integer mark, String fieldName) {
        if (mark == null || mark < 0 || mark > 10) {
            throw new RuntimeException(fieldName + " mark must be between 0 and 10");
        }
    }

    // Get a student's details
    public Student getStudentById(Long studentId) {
        return studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + studentId));
    }
}
