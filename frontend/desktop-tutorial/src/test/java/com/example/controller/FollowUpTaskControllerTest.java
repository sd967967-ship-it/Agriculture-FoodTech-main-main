package com.example.controller;

import com.example.entity.FollowUpTask;
import com.example.repository.FollowUpTaskRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE, properties = {
        "spring.datasource.url=jdbc:h2:mem:followuptest;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=false",
        "spring.datasource.driver-class-name=org.h2.Driver",
        "spring.datasource.username=sa",
        "spring.datasource.password=",
        "spring.jpa.hibernate.ddl-auto=create-drop"
})
class FollowUpTaskControllerTest {

    @Autowired
    private FollowUpTaskController controller;

    @Autowired
    private FollowUpTaskRepository repository;

    @BeforeEach
    void cleanUp() {
        repository.deleteAll();
    }

    @Test
    void createsFollowUpTaskWithValidPayload() {
        Map<String, Object> payload = Map.of(
                "farmId", 201L,
                "diagnosisId", 501L,
                "dueDate", "2026-09-24",
                "taskTitle", "Check leaf spot remission"
        );

        ResponseEntity<?> response = controller.createFollowUp(payload);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        @SuppressWarnings("unchecked")
        Map<String, Object> body = (Map<String, Object>) response.getBody();
        assertThat(body).isNotNull();
        assertThat(body.get("id")).isNotNull();
        assertThat(body.get("farmId")).isEqualTo(201L);
        assertThat(body.get("diagnosisId")).isEqualTo(501L);
        assertThat(body.get("dueDate")).isEqualTo("2026-09-24");
        assertThat(body.get("status")).isEqualTo("PENDING");
        assertThat(body.get("taskTitle")).isEqualTo("Check leaf spot remission");

        List<FollowUpTask> stored = repository.findAll();
        assertThat(stored).hasSize(1);
        assertThat(stored.get(0).getFarmId()).isEqualTo(201L);
        assertThat(stored.get(0).getDiagnosisId()).isEqualTo(501L);
    }

    @Test
    void createsFollowUpTaskWithDefaultDueDateAndStatus() {
        Map<String, Object> payload = Map.of(
                "farmId", 202L,
                "diagnosisId", 502L
        );

        ResponseEntity<?> response = controller.createFollowUp(payload);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        @SuppressWarnings("unchecked")
        Map<String, Object> body = (Map<String, Object>) response.getBody();
        assertThat(body).isNotNull();
        assertThat(body.get("status")).isEqualTo("PENDING");
        assertThat(body.get("dueDate")).isEqualTo(LocalDate.now().plusDays(7).toString());
        assertThat(body.get("taskTitle")).isNotNull();
    }

    @Test
    void validatesRequiredFields() {
        Map<String, Object> payload = Map.of(
                "farmId", 203L
        );

        ResponseEntity<?> response = controller.createFollowUp(payload);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);

        @SuppressWarnings("unchecked")
        Map<String, Object> body = (Map<String, Object>) response.getBody();
        assertThat(body).isNotNull();
        assertThat(body.get("error")).isEqualTo("VALIDATION_ERROR");
    }

    @Test
    void filtersFollowUpsByFarmIdAndStatus() {
        FollowUpTask task1 = repository.save(new FollowUpTask(301L, 601L, LocalDate.now().plusDays(3), "PENDING", "Task 1"));
        FollowUpTask task2 = repository.save(new FollowUpTask(301L, 602L, LocalDate.now().plusDays(5), "COMPLETED", "Task 2"));
        FollowUpTask task3 = repository.save(new FollowUpTask(302L, 603L, LocalDate.now().plusDays(1), "PENDING", "Task 3"));

        List<Map<String, Object>> allForFarm301 = controller.getFollowUps(301L, null);
        assertThat(allForFarm301).hasSize(2);

        List<Map<String, Object>> pendingForFarm301 = controller.getFollowUps(301L, "PENDING");
        assertThat(pendingForFarm301).hasSize(1);
        assertThat(pendingForFarm301.get(0).get("id")).isEqualTo(task1.getId());

        List<Map<String, Object>> allPending = controller.getFollowUps(null, "PENDING");
        assertThat(allPending).hasSize(2);
    }

    @Test
    void completesFollowUpTask() {
        FollowUpTask task = repository.save(new FollowUpTask(401L, 701L, LocalDate.now().plusDays(7), "PENDING", "Task to complete"));

        ResponseEntity<?> postResponse = controller.completeFollowUpPost(task.getId());
        assertThat(postResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
        @SuppressWarnings("unchecked")
        Map<String, Object> body = (Map<String, Object>) postResponse.getBody();
        assertThat(body).isNotNull();
        assertThat(body.get("status")).isEqualTo("COMPLETED");

        FollowUpTask reloaded = repository.findById(task.getId()).orElseThrow();
        assertThat(reloaded.getStatus()).isEqualTo("COMPLETED");
    }

    @Test
    void completesNonExistentTaskReturns404() {
        ResponseEntity<?> response = controller.completeFollowUpPost(99999L);
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }
}
