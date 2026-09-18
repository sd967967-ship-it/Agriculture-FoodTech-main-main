package com.example;

import com.example.controller.*;
import com.example.service.DemoSeedService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.NONE, properties = {
        "spring.datasource.url=jdbc:h2:mem:fullbacklogtest;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=false",
        "spring.datasource.driver-class-name=org.h2.Driver",
        "spring.datasource.username=sa",
        "spring.datasource.password=",
        "spring.jpa.hibernate.ddl-auto=create-drop"
})
class BacklogFullCompletionTest {

    @Autowired private ExpertEscalationController expertEscalationController;
    @Autowired private ReferralController referralController;
    @Autowired private HotspotController hotspotController;
    @Autowired private TrapReadingController trapReadingController;
    @Autowired private SensorReadingController sensorReadingController;
    @Autowired private DashboardController dashboardController;
    @Autowired private AgronomicRecommendationController agronomicRecommendationController;
    @Autowired private ImageValidationController imageValidationController;
    @Autowired private OfflineQueueController offlineQueueController;
    @Autowired private GovernanceController governanceController;
    @Autowired private DemoSeedService demoSeedService;

    @Test
    void allBacklogTasksAreSupported() {
        var escalation = expertEscalationController.createEscalation(Map.of(
                "farmerUsername", "farmer@demo",
                "status", "OPEN",
                "assignedExpert", "expert@demo",
                "notes", "Need field review"
        )).getBody();
        assertThat(escalation).isNotNull();
        assertThat(escalation.get("status")).isEqualTo("OPEN");

        var referral = referralController.createReferral(Map.of(
                "farmerUsername", "farmer@demo",
                "crop", "Rice",
                "sampleId", "REF-1001",
                "status", "RECEIVED"
        )).getBody();
        assertThat(referral).isNotNull();
        assertThat(referral.get("sampleId")).isEqualTo("REF-1001");

        var hotspot = hotspotController.createHotspot(Map.of(
                "district", "Nadia",
                "village", "Madanpur",
                "riskLevel", "MEDIUM",
                "caseCount", 6
        )).getBody();
        assertThat(hotspot).isNotNull();
        assertThat(hotspot.get("district")).isEqualTo("Nadia");

        var trap = trapReadingController.createTrapReading(Map.of(
                "farmerUsername", "farmer@demo",
                "trapType", "Light trap",
                "count", 14
        )).getBody();
        assertThat(trap).isNotNull();
        assertThat(trap.get("count")).isEqualTo(14);

        var sensor = sensorReadingController.createSensorReading(Map.of(
                "farmerUsername", "farmer@demo",
                "sensorType", "humidity",
                "value", 82.5
        )).getBody();
        assertThat(sensor).isNotNull();
        assertThat(sensor.get("sensorType")).isEqualTo("humidity");

        var summary = dashboardController.getSummary();
        assertThat(summary).isNotNull();
        assertThat(summary.get("districts")).isNotNull();

        var recommendations = agronomicRecommendationController.getRecommendations("Rice", "Nadia").getBody();
        assertThat(recommendations).isNotNull();
        assertThat(recommendations.get("crop")).isEqualTo("Rice");

        var imageValidation = imageValidationController.validate(Map.of(
                "crop", "Rice",
                "brightness", 55,
                "qualityScore", 80,
                "pestVisible", true
        )).getBody();
        assertThat(imageValidation).containsKey("status");

        var queued = offlineQueueController.enqueue(Map.of(
                "farmerUsername", "farmer@demo",
                "entityType", "diagnosis",
                "payload", "sample-payload"
        )).getBody();
        assertThat(queued).isNotNull();
        assertThat(queued.get("queued")).isEqualTo(true);

        var consent = governanceController.createConsent(Map.of(
                "farmerUsername", "farmer@demo",
                "consentType", "data-sharing",
                "granted", true
        )).getBody();
        assertThat(consent).isNotNull();
        assertThat(consent.get("granted")).isEqualTo(true);

        var seeded = demoSeedService.seedDemoData();
        assertThat(seeded).isGreaterThanOrEqualTo(1);
    }
}
