package com.example.service;

import com.example.dto.KisanMitraChatRequest;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.web.client.RestClient;

import static org.assertj.core.api.Assertions.assertThat;

class KisanMitraServiceTest {

    @Test
    void shouldReturnOfflineFallbackWhenNoHostedProviderIsConfigured() {
        KisanMitraService service = new KisanMitraService(
                new WBCropKnowledgeBase(),
                new WeatherService(new WBCropKnowledgeBase()),
                RestClient.builder(),
                new ObjectMapper()
        );

        KisanMitraChatRequest request = new KisanMitraChatRequest(
                "What should I do if my rice leaves are yellowing in Nadia?",
                "Rice",
                "Nadia",
                "en"
        );

        var response = service.ask(request);

        assertThat(response.answer()).contains("KisanMitra is offline");
        assertThat(response.grounded()).isFalse();
        assertThat(response.safetyNote()).isNotBlank();
    }
}
