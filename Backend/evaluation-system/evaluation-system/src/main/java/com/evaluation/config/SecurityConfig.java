package com.evaluation.config;

import com.evaluation.security.JwtAuthFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 * Security configuration:
 * - Public routes: anyone can access
 * - Admin routes: require JWT token
 */
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // Disable CSRF (not needed for REST APIs)
            .csrf(csrf -> csrf.disable())

            // Define which endpoints need authentication
            .authorizeHttpRequests(auth -> auth
                // Public endpoints - no token needed
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/teams/register").permitAll()
                .requestMatchers("/api/teams/*/score").permitAll()
                .requestMatchers("/api/teams/*").permitAll()
                .requestMatchers("/api/leaderboard").permitAll()
                .requestMatchers("/api/home/stats").permitAll()
                // Admin endpoints - JWT token required
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                // Everything else needs authentication
                .anyRequest().authenticated()
            )

            // Use stateless sessions (JWT handles auth, no sessions)
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

            // Add our JWT filter before the default auth filter
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // BCrypt password encoder bean
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
