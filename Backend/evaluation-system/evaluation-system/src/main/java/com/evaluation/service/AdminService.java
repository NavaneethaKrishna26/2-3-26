package com.evaluation.service;

import com.evaluation.dto.*;
import com.evaluation.entity.Student;
import com.evaluation.entity.Team;
import com.evaluation.repository.StudentRepository;
import com.evaluation.repository.TeamRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final TeamRepository teamRepository;
    private final StudentRepository studentRepository;
    private final TeamService teamService;

    // Get all teams summary
    public List<TeamSummaryResponse> getAllTeams() {
        return teamRepository.findAll().stream()
                .map(t -> new TeamSummaryResponse(
                        t.getTeamId(), t.getTeamName(), t.getOverallScore(), t.getEvaluationStatus()))
                .collect(Collectors.toList());
    }

    // Get detailed team info for admin
    public TeamDetailsResponse getTeamDetails(Long teamId) {
        Team team = findTeamOrThrow(teamId);

        List<Student> students = studentRepository.findByTeamTeamId(teamId);
        List<StudentResponse> studentResponses = students.stream()
                .map(teamService::convertToStudentResponse)
                .collect(Collectors.toList());

        return new TeamDetailsResponse(
                team.getTeamId(), team.getTeamName(), team.getOverallScore(),
                team.getEvaluationStatus(), team.getLocked(), studentResponses
        );
    }

    // Submit marks for a student and recalculate team score
    @Transactional
    public MessageResponse evaluateStudent(Long studentId, EvaluateStudentRequest request) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + studentId));

        // Check if team is locked
        if (student.getTeam().getLocked()) {
            throw new RuntimeException("This team is locked and cannot be re-evaluated.");
        }

        // Save marks
        student.setCommunication(request.getCommunication());
        student.setTechnical(request.getTechnical());
        student.setInnovation(request.getInnovation());
        student.setCollaboration(request.getCollaboration());
        student.setPresentation(request.getPresentation());

        // Calculate student's total score
        int total = request.getCommunication() + request.getTechnical() +
                    request.getInnovation() + request.getCollaboration() + request.getPresentation();
        student.setTotalScore(total);
        student.setEvaluated(true);
        studentRepository.save(student);

        // Recalculate team overall score (average of evaluated students)
        recalculateTeamScore(student.getTeam().getTeamId());

        return new MessageResponse("Marks submitted for " + student.getName());
    }

    // Get single student details
    public StudentResponse getStudentDetails(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found with id: " + studentId));
        return teamService.convertToStudentResponse(student);
    }

    // Lock a team (prevent further editing)
    @Transactional
    public MessageResponse lockTeam(Long teamId) {
        Team team = findTeamOrThrow(teamId);
        team.setLocked(true);
        teamRepository.save(team);
        return new MessageResponse("Team locked successfully.");
    }

    // Helper: recalculate and update team's overall score
    private void recalculateTeamScore(Long teamId) {
        Team team = findTeamOrThrow(teamId);
        List<Student> students = studentRepository.findByTeamTeamId(teamId);

        List<Student> evaluatedStudents = students.stream()
                .filter(Student::getEvaluated)
                .collect(Collectors.toList());

        if (!evaluatedStudents.isEmpty()) {
            double average = evaluatedStudents.stream()
                    .mapToInt(Student::getTotalScore)
                    .average()
                    .orElse(0.0);
            team.setOverallScore(average);
        }

        // If all students are evaluated, mark team as EVALUATED
        if (evaluatedStudents.size() == students.size()) {
            team.setEvaluationStatus("EVALUATED");
        }

        teamRepository.save(team);
    }

    private Team findTeamOrThrow(Long teamId) {
        return teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Team not found with id: " + teamId));
    }
}
