package com.example.dto;

public record KisanMitraChatResponse(
        String answer,
        String safetyNote,
        String language,
        boolean grounded,
        String source
) {
}
