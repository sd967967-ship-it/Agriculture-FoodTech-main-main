package com.example.service;

import com.example.repository.*;
import com.example.entity.AppUser;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.List;

@Service
public class DemoSeedService implements CommandLineRunner {
    private final FarmRepository farmRepository;
    private final FieldRepository fieldRepository;
    private final AlertMessageRepository alertMessageRepository;
    private final DiagnosisFeedbackRepository diagnosisFeedbackRepository;
    private final MonitoringPlanRepository monitoringPlanRepository;
    private final ExpertEscalationRepository expertEscalationRepository;
    private final ReferralRepository referralRepository;
    private final HotspotRepository hotspotRepository;
    private final TrapReadingRepository trapReadingRepository;
    private final SensorReadingRepository sensorReadingRepository;
    private final GovernanceConsentRepository governanceConsentRepository;
    private final UserQueryRepository userQueryRepository;
    private final PredictionLogRepository predictionLogRepository;
    private final UserRepository userRepository;

    public DemoSeedService(FarmRepository farmRepository, FieldRepository fieldRepository,
                          AlertMessageRepository alertMessageRepository,
                          DiagnosisFeedbackRepository diagnosisFeedbackRepository,
                          MonitoringPlanRepository monitoringPlanRepository,
                          ExpertEscalationRepository expertEscalationRepository,
                          ReferralRepository referralRepository,
                          HotspotRepository hotspotRepository,
                          TrapReadingRepository trapReadingRepository,
                          SensorReadingRepository sensorReadingRepository,
                          GovernanceConsentRepository governanceConsentRepository,
                          UserQueryRepository userQueryRepository,
                          PredictionLogRepository predictionLogRepository,
                          UserRepository userRepository) {
        this.farmRepository = farmRepository;
        this.fieldRepository = fieldRepository;
        this.alertMessageRepository = alertMessageRepository;
        this.diagnosisFeedbackRepository = diagnosisFeedbackRepository;
        this.monitoringPlanRepository = monitoringPlanRepository;
        this.expertEscalationRepository = expertEscalationRepository;
        this.referralRepository = referralRepository;
        this.hotspotRepository = hotspotRepository;
        this.trapReadingRepository = trapReadingRepository;
        this.sensorReadingRepository = sensorReadingRepository;
        this.governanceConsentRepository = governanceConsentRepository;
        this.userQueryRepository = userQueryRepository;
        this.predictionLogRepository = predictionLogRepository;
        this.userRepository = userRepository;
    }

    @Override
    public void run(String... args) {
        seedDemoUser();
        seedDemoData();
    }

    private void seedDemoUser() {
        for (int index = 1; index <= 49; index++) {
            seedUser("demo.farmer" + String.format("%02d", index));
        }
        seedUser("demo.farmer");
        seedUser("admin.fasal", "ADMIN");
    }

    private void seedUser(String username) {
        seedUser(username, "FARMER");
    }

    private void seedUser(String username, String role) {
        if (userRepository.findByUsername(username).isEmpty()) {
            userRepository.save(new AppUser(username, hashPassword("Fasal@123"), role));
        }
    }

    private String hashPassword(String password) {
        try {
            byte[] hash = MessageDigest.getInstance("SHA-256")
                    .digest(password.getBytes(StandardCharsets.UTF_8));
            StringBuilder result = new StringBuilder();
            for (byte value : hash) {
                result.append(String.format("%02x", value));
            }
            return result.toString();
        } catch (NoSuchAlgorithmException exception) {
            throw new IllegalStateException("Password hashing is not available", exception);
        }
    }

    public int seedDemoData() {
        seedDiagnosisHistory();

        List<String> farmerNames = List.of(
                "Subhash Mondal", "Animesh Ghosh", "Priya Biswas", "Mukul Das", "Rina Saha",
                "Bimal Roy", "Kajal Dutta", "Tapan Sarkar", "Mita Pal", "Gopal Nandi",
                "Sushanta Jana", "Madhuri Paul", "Debashis Ghosh", "Mala Karmakar", "Ratan Halder",
                "Soma Mondal", "Ashim Das", "Kakoli Roy", "Nirmal Sardar", "Purnima Ghosh",
                "Bikash Maity", "Rekha Das", "Tarun Biswas", "Mousumi Pal", "Haradhan Saha",
                "Arindam Nandi", "Shikha Roy", "Pradip Jana", "Anita Halder", "Kunal Dutta",
                "Sanjay Ghosh", "Lata Sardar", "Samar Das", "Jharna Pal", "Manas Roy",
                "Chaitali Saha", "Sourav Mondal", "Mina Biswas", "Dilip Nandi", "Kalyani Ghosh",
                "Rabi Karmakar", "Moumita Das", "Sukumar Jana", "Asha Halder", "Naren Pal",
                "Bina Roy", "Sujit Saha", "Ila Dutta", "Kishore Ghosh", "Ananya Sardar"
        );
        String[] districts = {"Nadia", "Murshidabad", "Hooghly", "Bardhaman", "Bankura"};
        String[] crops = {"Rice", "Potato", "Tomato", "Jute", "Mustard"};
        String[] diagnoses = {"Suspected Late Blight", "BPH Infestation", "Leaf Curl Virus", "Stem Rot", "Aphid Pressure"};

        if (expertEscalationRepository.count() == 0 && referralRepository.count() == 0) {
            for (int index = 0; index < farmerNames.size(); index++) {
                String farmer = farmerNames.get(index);
                String district = districts[index % districts.length];
                String crop = crops[index % crops.length];
                String diagnosis = diagnoses[index % diagnoses.length];
                String farmerUsername = farmer;

                if (index < 25) {
                    expertEscalationRepository.save(new com.example.entity.ExpertEscalation(
                            farmerUsername,
                            "PENDING_EXPERT",
                            "kvk." + district.toLowerCase() + "@demo",
                            farmer + " | " + crop + " | " + district + " | " + diagnosis
                    ));
                } else {
                    referralRepository.save(new com.example.entity.Referral(
                            farmerUsername,
                            crop,
                            "LAB-2026-" + String.format("%03d", index + 1),
                            "PENDING_LAB"
                    ));
                }
            }
        }

        int rows = 0;
        rows += farmRepository.count();
        rows += fieldRepository.count();
        rows += alertMessageRepository.count();
        rows += diagnosisFeedbackRepository.count();
        rows += monitoringPlanRepository.count();
        rows += expertEscalationRepository.count();
        rows += referralRepository.count();
        rows += hotspotRepository.count();
        rows += trapReadingRepository.count();
        rows += sensorReadingRepository.count();
        rows += governanceConsentRepository.count();
        rows += userQueryRepository.count();
        rows += predictionLogRepository.count();
        return rows;
    }

    private void seedDiagnosisHistory() {
        long existingRecords = predictionLogRepository.count();
        if (existingRecords >= 100) {
            return;
        }

        String[] crops = {"Rice", "Potato", "Tomato", "Jute", "Mustard", "Mango", "Wheat", "Maize"};
        String[] stages = {"vegetative", "flowering", "fruiting", "tillering", "harvest"};
        String[] districts = {"Nadia", "Murshidabad", "Hooghly", "Bardhaman", "Bankura", "Malda", "Purulia", "Jalpaiguri"};
        String[] diseases = {"Rice Blast", "Late Blight", "Tomato Leaf Curl", "Jute Stem Rot", "Mustard Aphid", "Mango Powdery Mildew", "Wheat Rust", "Maize Fall Armyworm"};
        String[] observations = {
                "Yellowing leaves with small spreading lesions.",
                "Brown spots visible after recent rainfall.",
                "Curling leaves and reduced new growth observed.",
                "Farmer reports wilting in a small field patch.",
                "Insects visible beneath leaves during field inspection."
        };

        for (int index = (int) existingRecords; index < 100; index++) {
            boolean escalated = index % 4 == 0;
            predictionLogRepository.save(new com.example.entity.PredictionLog(
                    crops[index % crops.length],
                    stages[index % stages.length],
                    districts[index % districts.length],
                    22.5 + (index % 8) * 0.08,
                    88.1 + (index % 8) * 0.07,
                    observations[index % observations.length],
                    diseases[index % diseases.length],
                    Math.round((0.62 + (index % 35) / 100.0) * 100.0) / 100.0,
                    escalated ? "EXPERT_REVIEW" : "AI_ADVISORY",
                    escalated,
                        index % 3 == 0 ? "bn" : index % 3 == 1 ? "hi" : "en",
                        index % 50 == 0 ? "demo.farmer" : "demo.farmer" + String.format("%02d", (index % 49) + 1)
            ));
        }
    }
}
