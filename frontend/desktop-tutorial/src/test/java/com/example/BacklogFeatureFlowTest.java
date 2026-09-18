package com.example;

import com.example.controller.DiagnosisFeedbackController;
import com.example.controller.FarmController;
import com.example.controller.FieldController;
import com.example.controller.MonitoringPlanController;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE, properties = {
        "spring.datasource.url=jdbc:h2:mem:backlogtest;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=false",
        "spring.datasource.driver-class-name=org.h2.Driver",
        "spring.datasource.username=sa",
        "spring.datasource.password=",
        "spring.jpa.hibernate.ddl-auto=create-drop"
})
class BacklogFeatureFlowTest {

    @Autowired
    private FarmController farmController;

    @Autowired
    private FieldController fieldController;

    @Autowired
    private DiagnosisFeedbackController diagnosisFeedbackController;

    @Autowired
    private MonitoringPlanController monitoringPlanController;

    @Test
    void farmFieldFeedbackAndMonitoringFlowWorks() {
        var farmResponse = farmController.createFarm(Map.of(
                "name", "North Plot",
                "farmerUsername", "farmer@demo",
                "district", "Nadia"
        )).getBody();

        assertThat(farmResponse).isNotNull();
        assertThat(farmResponse.get("id")).isNotNull();

        var fieldResponse = fieldController.createField(Map.of(
                "farmId", farmResponse.get("id"),
                "name", "Plot A",
                "crop", "Rice",
                "season", "Kharif"
        )).getBody();

        assertThat(fieldResponse).isNotNull();
        assertThat(fieldResponse.get("farmId")).isEqualTo(farmResponse.get("id"));

        var feedbackResponse = diagnosisFeedbackController.createFeedback(Map.of(
                "farmerUsername", "farmer@demo",
                "diagnosis", "Leaf blast",
                "label", "yes",
                "modelVersion", "v2.1"
        )).getBody();

        assertThat(feedbackResponse).isNotNull();
        assertThat(feedbackResponse.get("diagnosis")).isEqualTo("Leaf blast");

        var planResponse = monitoringPlanController.createMonitoringPlan(Map.of(
                "farmerUsername", "farmer@demo",
                "crop", "Rice",
                "intervalDays", 7
        )).getBody();

        assertThat(planResponse).isNotNull();
        assertThat(planResponse.get("intervalDays")).isEqualTo(7);
    }
}
