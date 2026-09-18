package com.example.auth;

import com.example.entity.AppUser;
import com.example.repository.UserRepository;
import com.example.service.AuthService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.Import;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@Import(AuthService.class)
class AuthServiceTest {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuthService authService;

    @Test
    void registersAndAuthenticatesFarmerAccount() {
        AppUser user = authService.register("farmer@demo", "secret123", "FARMER");

        assertThat(user.getId()).isNotNull();
        assertThat(userRepository.findByUsername("farmer@demo")).isPresent();
        assertThat(authService.authenticate("farmer@demo", "secret123")).isTrue();
        assertThat(authService.authenticate("farmer@demo", "wrong-password")).isFalse();
    }
}
