package com.evaluation.service;

import com.evaluation.dto.RegisterTeamRequest;
import com.evaluation.dto.StudentResponse;
import com.evaluation.entity.Student;
import com.evaluation.entity.Team;
import com.evaluation.repository.StudentRepository;
import com.evaluation.repository.TeamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class TeamService {

    @Autowired
    private TeamRepository teamRepository;

    @Autowired
    private StudentRepository studentRepository;

    // Register a new team with its members
    public Map<String, Object> registerTeam(RegisterTeamRequest request) {
        // Validate: team must have 1 to 4 members
        if (request.getMembers() == null || request.getMembers().isEmpty()) {
            throw new RuntimeException("Team must have at least 1 member");
        }
        if (request.getMembers().size() > 4) {
            throw new RuntimeException("Team cannot have more than 4 members");
        }

        // Check for duplicate roll numbers in the request itself
        Set<String> rollNumbers = new HashSet<>();
        for (RegisterTeamRequest.MemberRequest m : request.getMembers()) {
            if (!rollNumbers.add(m.getRollNumber())) {
                throw new RuntimeException("Duplicate roll number in request: " + m.getRollNumber());
            }
            // Check if roll number already exists in database
            if (studentRepository.existsByRollNumber(m.getRollNumber())) {
                throw new RuntimeException("Roll number already registered: " + m.getRollNumber());
            }
        }

        // Create team
        Team team = new Team();
        team.setTeamName(request.getTeamName());
        team.setEvaluationStatus("PENDING");
        team.setOverallScore(0.0);
        team.setLocked(false);

        Team savedTeam = teamRepository.save(team);

        // Create students and link to team
        for (RegisterTeamRequest.MemberRequest memberRequest : request.getMembers()) {
            Student student = new Student();
            student.setName(memberRequest.getName());
            student.setRollNumber(memberRequest.getRollNumber());
            student.setRole(memberRequest.getRole());
            student.setTotalScore(0);
            student.setTeam(savedTeam);
            studentRepository.save(student);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("teamId", savedTeam.getTeamId());
        response.put("message", "Team registered successfully");
        return response;
    }

    // Get team details by team ID
    public Team getTeamById(Long teamId) {
        return teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Team not found with id: " + teamId));
    }

    // Get team score summary
    public Map<String, Object> getTeamScore(Long teamId) {
        Team team = getTeamById(teamId);

        List<Map<String, Object>> memberScores = new ArrayList<>();
        for (Student s : team.getMembers()) {
            Map<String, Object> memberScore = new HashMap<>();
            memberScore.put("name", s.getName());
            memberScore.put("totalScore", s.getTotalScore());
            memberScores.add(memberScore);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("teamName", team.getTeamName());
        response.put("overallScore", team.getOverallScore());
        response.put("members", memberScores);
        return response;
    }

    // Get all teams (for admin)
    public List<Map<String, Object>> getAllTeams() {
        List<Team> teams = teamRepository.findAll();
        List<Map<String, Object>> result = new ArrayList<>();

        for (Team team : teams) {
            Map<String, Object> t = new HashMap<>();
            t.put("teamId", team.getTeamId());
            t.put("teamName", team.getTeamName());
            t.put("overallScore", team.getOverallScore());
            t.put("evaluationStatus", team.getEvaluationStatus());
            t.put("locked", team.getLocked());
            result.add(t);
        }
        return result;
    }

    // Lock a team to prevent re-editing
    public Map<String, String> lockTeam(Long teamId) {
        Team team = getTeamById(teamId);
        team.setLocked(true);
        teamRepository.save(team);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Team locked successfully");
        return response;
    }

    // Leaderboard - all teams sorted by score
    public List<Map<String, Object>> getLeaderboard() {
        List<Team> teams = teamRepository.findAllByOrderByOverallScoreDesc();
        List<Map<String, Object>> result = new ArrayList<>();

        int rank = 1;
        for (Team team : teams) {
            Map<String, Object> t = new HashMap<>();
            t.put("rank", rank++);
            t.put("teamId", team.getTeamId());
            t.put("teamName", team.getTeamName());
            t.put("overallScore", team.getOverallScore());
            t.put("evaluationStatus", team.getEvaluationStatus());
            result.add(t);
        }
        return result;
    }

    // Home stats
    public Map<String, Object> getHomeStats() {
        long totalTeams = teamRepository.count();
        long evaluatedTeams = teamRepository.countByEvaluationStatus("EVALUATED");
        long pendingTeams = teamRepository.countByEvaluationStatus("PENDING");

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalTeams", totalTeams);
        stats.put("evaluatedTeams", evaluatedTeams);
        stats.put("pendingTeams", pendingTeams);
        return stats;
    }

    // Convert Student entity to StudentResponse DTO
    public StudentResponse convertToStudentResponse(Student student) {
        return new StudentResponse(
                student.getStudentId(),
                student.getName(),
                student.getRollNumber(),
                student.getRole(),
                student.getCommunication(),
                student.getTechnical(),
                student.getInnovation(),
                student.getCollaboration(),
                student.getPresentation(),
                student.getTotalScore(),
                student.getEvaluated()
        );
    }

    public void deleteTeam(Long teamId)
    {
        teamRepository.deleteById(teamId);
    }
}
