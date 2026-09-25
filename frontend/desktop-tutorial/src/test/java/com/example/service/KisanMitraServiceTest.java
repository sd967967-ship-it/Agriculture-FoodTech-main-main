package com.example.service;

import com.example.dto.KisanMitraChatRequest;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.web.client.RestClient;

import static org.assertj.core.api.Assertions.assertThat;

class KisanMitraServiceTest {

    @Test
    void shouldReturnLocalKnowledgeWhenNoHostedProviderIsConfigured() {
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

        assertThat(response.answer()).contains("Rice");
        assertThat(response.grounded()).isTrue();
        assertThat(response.safetyNote()).isNotBlank();
    }

    @Test
    void shouldAnswerGreetingTimeAndWeatherFromAppData() {
        KisanMitraService service = new KisanMitraService(
                new WBCropKnowledgeBase(),
                new WeatherService(new WBCropKnowledgeBase()),
                RestClient.builder(),
                new ObjectMapper()
        );

        var hi = service.ask(new KisanMitraChatRequest("hi", "Rice", "Nadia", "en"));
        assertThat(hi.answer()).contains("KisanMitra");
        assertThat(hi.source()).isEqualTo("app-data");

        var time = service.ask(new KisanMitraChatRequest("what time is it?", "Rice", "Nadia", "en"));
        assertThat(time.answer()).contains("IST");

        var weather = service.ask(new KisanMitraChatRequest("what is the weather today?", "Rice", "Nadia", "en"));
        assertThat(weather.answer()).contains("Nadia");
    }

    @Test
    void shouldAnswerFallbackInBengaliWhenLanguageIsBn() {
        KisanMitraService service = new KisanMitraService(
                new WBCropKnowledgeBase(),
                new WeatherService(new WBCropKnowledgeBase()),
                RestClient.builder(),
                new ObjectMapper()
        );

        var response = service.ask(new KisanMitraChatRequest(
                "dhaner pata holud hoye jachhe, ki korbo?", "Rice", "Nadia", "bn"));

        assertThat(response.answer()).contains("আপনার প্রশ্ন");
        assertThat(response.grounded()).isTrue();
    }
}
