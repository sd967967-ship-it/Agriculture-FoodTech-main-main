package com.example.service;

import com.example.entity.AppUser;
import com.example.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Duration;
import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

@Service
public class AuthService {

    private static final Duration SESSION_TTL = Duration.ofHours(12);

    private final UserRepository userRepository;

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public AppUser register(String username, String password, String role) {
        String normalizedUsername = normalizeUsername(username);
        String normalizedRole = normalizeRole(role);
        if (normalizedUsername.isBlank()) {
            throw new IllegalArgumentException("Username cannot be blank");
        }
        if (password == null || password.isBlank()) {
            throw new IllegalArgumentException("Password cannot be blank");
        }
        if (userRepository.findByUsername(normalizedUsername).isPresent()) {
            throw new IllegalArgumentException("A user with that username already exists");
        }

        AppUser user = new AppUser(normalizedUsername, hashPassword(password), normalizedRole);
        return issueSession(user);
    }

    public AppUser login(String username, String password) {
        String normalizedUsername = normalizeUsername(username);
        AppUser user = userRepository.findByUsername(normalizedUsername)
                .orElseThrow(() -> new IllegalArgumentException("Invalid username or password"));

        if (!user.getPasswordHash().equals(hashPassword(password))) {
            throw new IllegalArgumentException("Invalid username or password");
        }

        return issueSession(user);
    }

    public boolean authenticate(String username, String password) {
        String normalizedUsername = normalizeUsername(username);
        if (normalizedUsername.isBlank() || password == null || password.isBlank()) {
            return false;
        }
        return userRepository.findByUsername(normalizedUsername)
                .map(user -> user.getPasswordHash().equals(hashPassword(password)))
                .orElse(false);
    }

    public Optional<AppUser> findBySessionToken(String token) {
        if (token == null || token.isBlank()) {
            return Optional.empty();
        }
        return userRepository.findBySessionToken(token)
                .filter(user -> user.getSessionExpiresAt() != null && user.getSessionExpiresAt().isAfter(Instant.now()));
    }

    private AppUser issueSession(AppUser user) {
        user.setSessionToken(UUID.randomUUID().toString());
        user.setSessionExpiresAt(Instant.now().plus(SESSION_TTL));
        return userRepository.save(user);
    }

    private String normalizeUsername(String username) {
        return username == null ? "" : username.trim();
    }

    private String normalizeRole(String role) {
        String normalized = role == null ? "FARMER" : role.trim().toUpperCase();
        if (normalized.isBlank()) {
            return "FARMER";
        }
        return switch (normalized) {
            case "ADMIN", "EXPERT", "FARMER" -> normalized;
            default -> "FARMER";
        };
    }

    private String hashPassword(String password) {
        try {
            MessageDigest messageDigest = MessageDigest.getInstance("SHA-256");
            byte[] hash = messageDigest.digest(password.getBytes());
            StringBuilder hex = new StringBuilder();
            for (byte value : hash) {
                hex.append(String.format("%02x", value));
            }
            return hex.toString();
        } catch (NoSuchAlgorithmException ex) {
            throw new IllegalStateException("Password hashing is not available in this environment", ex);
        }
    }
}
