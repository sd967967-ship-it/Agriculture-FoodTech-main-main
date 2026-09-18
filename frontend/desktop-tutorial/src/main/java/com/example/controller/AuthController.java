package com.example.controller;

import com.example.entity.AppUser;
import com.example.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody Map<String, String> payload) {
        AppUser user = authService.register(payload.getOrDefault("username", ""), payload.getOrDefault("password", ""), payload.getOrDefault("role", "FARMER"));
        return ResponseEntity.ok(asResponse(user));
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> payload) {
        AppUser user = authService.login(payload.getOrDefault("username", ""), payload.getOrDefault("password", ""));
        return ResponseEntity.ok(asResponse(user));
    }

    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> currentUser(@RequestHeader(value = "X-Session-Token", required = false) String token) {
        Optional<AppUser> sessionUser = authService.findBySessionToken(token);
        if (sessionUser.isEmpty()) {
            return ResponseEntity.status(401).body(Map.of("error", "UNAUTHORIZED", "message", "Session is invalid or expired"));
        }
        return ResponseEntity.ok(asResponse(sessionUser.get()));
    }

    @org.springframework.web.bind.annotation.ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleIllegalArgument(IllegalArgumentException ex) {
        return ResponseEntity.badRequest().body(Map.of("error", "BAD_REQUEST", "message", ex.getMessage()));
    }

    private Map<String, Object> asResponse(AppUser user) {
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("id", user.getId());
        response.put("username", user.getUsername());
        response.put("role", user.getRole());
        response.put("sessionToken", user.getSessionToken());
        response.put("createdAt", user.getCreatedAt());
        return response;
    }
}

