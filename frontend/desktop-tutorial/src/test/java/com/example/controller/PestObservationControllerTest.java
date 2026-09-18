package com.example.controller;

import com.example.entity.PestObservation;
import com.example.repository.PestObservationRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.Instant;
import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE, properties = {
        "spring.datasource.url=jdbc:h2:mem:pesttest;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=false",
        "spring.datasource.driver-class-name=org.h2.Driver",
        "spring.datasource.username=sa",
        "spring.datasource.password=",
        "spring.jpa.hibernate.ddl-auto=create-drop"
})
class PestObservationControllerTest {

    @Autowired
    private PestObservationController controller;

    @Autowired
    private PestObservationRepository repository;

    @BeforeEach
    void cleanUp() {
        repository.deleteAll();
    }

    @Test
    void createsPestObservationWithValidPayload() {
        Map<String, Object> payload = Map.of(
                "farmId", 101L,
                "pestType", "Fall Armyworm",
                "count", 14,
                "source", "manual"
        );

        ResponseEntity<?> response = controller.createPestObservation(payload);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        @SuppressWarnings("unchecked")
        Map<String, Object> body = (Map<String, Object>) response.getBody();
        assertThat(body).isNotNull();
        assertThat(body.get("id")).isNotNull();
        assertThat(body.get("farmId")).isEqualTo(101L);
        assertThat(body.get("pestType")).isEqualTo("Fall Armyworm");
        assertThat(body.get("count")).isEqualTo(14);
        assertThat(body.get("source")).isEqualTo("manual");
        assertThat(body.get("timestamp")).isNotNull();

        List<PestObservation> stored = repository.findAll();
        assertThat(stored).hasSize(1);
        assertThat(stored.get(0).getPestType()).isEqualTo("Fall Armyworm");
        assertThat(stored.get(0).getCount()).isEqualTo(14);
    }

    @Test
    void defaultsSourceToManualWhenOmitted() {
        Map<String, Object> payload = Map.of(
                "farmId", 102L,
                "pestType", "Aphids",
                "count", 45
        );

        ResponseEntity<?> response = controller.createPestObservation(payload);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        @SuppressWarnings("unchecked")
        Map<String, Object> body = (Map<String, Object>) response.getBody();
        assertThat(body).isNotNull();
        assertThat(body.get("source")).isEqualTo("manual");
    }

    @Test
    void acceptsSensorAsSourceAndCustomTimestamp() {
        String isoTime = "2026-09-17T05:00:00Z";
        Map<String, Object> payload = Map.of(
                "farmId", 103L,
                "pestType", "Yellow Stem Borer",
                "count", 8,
                "source", "sensor",
                "timestamp", isoTime
        );

        ResponseEntity<?> response = controller.createPestObservation(payload);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        @SuppressWarnings("unchecked")
        Map<String, Object> body = (Map<String, Object>) response.getBody();
        assertThat(body).isNotNull();
        assertThat(body.get("source")).isEqualTo("sensor");
        assertThat(body.get("timestamp")).isEqualTo(isoTime);
    }

    @Test
    void rejectsMissingRequiredFields() {
        ResponseEntity<?> response = controller.createPestObservation(Map.of(
                "farmId", 101L,
                "pestType", ""
        ));
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);

        response = controller.createPestObservation(Map.of(
                "pestType", "Aphids",
                "count", 5
        ));
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    @Test
    void rejectsNegativeCountAndInvalidSource() {
        ResponseEntity<?> response = controller.createPestObservation(Map.of(
                "farmId", 101L,
                "pestType", "Aphids",
                "count", -3
        ));
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);

        response = controller.createPestObservation(Map.of(
                "farmId", 101L,
                "pestType", "Aphids",
                "count", 5,
                "source", "satellite"
        ));
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    @Test
    void getsPestObservationsFilteredAndUnfiltered() {
        repository.save(new PestObservation(1L, "Aphids", 10, "manual", Instant.now().minusSeconds(60)));
        repository.save(new PestObservation(2L, "Whitefly", 25, "sensor", Instant.now()));

        List<Map<String, Object>> all = controller.getPestObservations(null);
        assertThat(all).hasSize(2);

        List<Map<String, Object>> forFarm1 = controller.getPestObservations(1L);
        assertThat(forFarm1).hasSize(1);
        assertThat(forFarm1.get(0).get("pestType")).isEqualTo("Aphids");
    }
}
