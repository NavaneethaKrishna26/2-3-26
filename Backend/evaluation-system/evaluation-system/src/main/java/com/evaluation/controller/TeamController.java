package com.evaluation.controller;

import com.evaluation.dto.RegisterTeamRequest;
import com.evaluation.entity.Team;
import com.evaluation.service.TeamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class TeamController {

    @Autowired
    private TeamService teamService;

    // POST /api/teams/register  (Public)
    @PostMapping("/teams/register")
    public ResponseEntity<?> registerTeam(@RequestBody RegisterTeamRequest request) {
        try {
            Map<String, Object> response = teamService.registerTeam(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // GET /api/teams/{teamId}  (Public)
    @GetMapping("/teams/{teamId}")
    public ResponseEntity<?> getTeam(@PathVariable Long teamId) {
        try {
            Team team = teamService.getTeamById(teamId);
            return ResponseEntity.ok(team);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    //Delete
    @DeleteMapping("/teams/{teamId}")
    public ResponseEntity<?> deleteTeam(@PathVariable Long teamId){
        try{
            teamService.deleteTeam(teamId);
            return ResponseEntity.ok("Delete Success");
        }catch(RuntimeException e){
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }


    // GET /api/teams/{teamId}/score  (Public)
    @GetMapping("/teams/{teamId}/score")
    public ResponseEntity<?> getTeamScore(@PathVariable Long teamId) {
        try {
            Map<String, Object> score = teamService.getTeamScore(teamId);
            return ResponseEntity.ok(score);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // GET /api/leaderboard  (Public)
    @GetMapping("/leaderboard")
    public ResponseEntity<?> getLeaderboard() {
        return ResponseEntity.ok(teamService.getLeaderboard());
    }

    // GET /api/home/stats  (Public)
    @GetMapping("/home/stats")
    public ResponseEntity<?> getHomeStats() {
        return ResponseEntity.ok(teamService.getHomeStats());
    }
}
