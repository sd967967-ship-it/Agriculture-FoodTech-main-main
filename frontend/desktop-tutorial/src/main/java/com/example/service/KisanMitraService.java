package com.example.service;

import com.example.dto.KisanMitraChatRequest;
import com.example.dto.KisanMitraChatResponse;
import com.example.entity.UserQuery;
import com.example.repository.UserQueryRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.time.Duration;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

@Service
public class KisanMitraService {

    private final WBCropKnowledgeBase knowledgeBase;
    private final WeatherService weatherService;
    private final RestClient restClient;
    private final ObjectMapper objectMapper;
    private final UserQueryRepository userQueryRepository;
    private final MandiUpdates mandiUpdates;

    @Value("${kisanmitra.provider:gemini}")
    private String provider;

    @Value("${GEMINI_API_KEY:}")
    private String geminiApiKey;

    @Value("${GROQ_API_KEY:}")
    private String groqApiKey;

    @Value("${OPENROUTER_API_KEY:}")
    private String openRouterApiKey;

    @Value("${KISANMITRA_TIMEOUT_MS:12000}")
    private int timeoutMs;

    @Value("${kisanmitra.ollama-url:http://localhost:11434}")
    private String ollamaUrl;

    @Value("${kisanmitra.ollama-model:qwen2.5:3b}")
    private String ollamaModel;

    @Autowired
    public KisanMitraService(WBCropKnowledgeBase knowledgeBase,
                             WeatherService weatherService,
                             RestClient.Builder restClientBuilder,
                             ObjectMapper objectMapper,
                             UserQueryRepository userQueryRepository,
                             MandiUpdates mandiUpdates) {
        this.knowledgeBase = knowledgeBase;
        this.weatherService = weatherService;
        SimpleClientHttpRequestFactory requestFactory = new SimpleClientHttpRequestFactory();
        requestFactory.setConnectTimeout(Duration.ofSeconds(10));
        requestFactory.setReadTimeout(Duration.ofSeconds(25));
        this.restClient = restClientBuilder
                .defaultHeader("User-Agent", "FasalSathi-KisanMitra/1.0")
                .requestFactory(requestFactory)
                .build();
        this.objectMapper = objectMapper;
        this.userQueryRepository = userQueryRepository;
        this.mandiUpdates = mandiUpdates;
    }

    public KisanMitraService(WBCropKnowledgeBase knowledgeBase,
                             WeatherService weatherService,
                             RestClient.Builder restClientBuilder,
                             ObjectMapper objectMapper,
                             UserQueryRepository userQueryRepository) {
        this(knowledgeBase, weatherService, restClientBuilder, objectMapper, userQueryRepository, null);
    }

    public KisanMitraService(WBCropKnowledgeBase knowledgeBase,
                             WeatherService weatherService,
                             RestClient.Builder restClientBuilder,
                             ObjectMapper objectMapper) {
        this(knowledgeBase, weatherService, restClientBuilder, objectMapper, null, null);
    }

    public KisanMitraChatResponse ask(KisanMitraChatRequest request) {
        return ask(request, "anonymous");
    }

    public KisanMitraChatResponse ask(KisanMitraChatRequest request, String username) {
        String question = request == null || request.question() == null ? "" : request.question().trim();
        String crop = request == null || request.crop() == null ? "" : request.crop().trim();
        String district = request == null || request.district() == null ? "" : request.district().trim();
        String language = request == null || request.language() == null || request.language().isBlank() ? "en" : request.language();

        if (question.isBlank()) {
                KisanMitraChatResponse response = new KisanMitraChatResponse(
                    "KisanMitra is offline, try again shortly.",
                    "The local KVK should be consulted for urgent crop decisions until the hosted chatbot is available.",
                    language,
                    false,
                    "offline"
            );
                    recordQuery(question, username, crop, district, language, response);
                    return response;
        }

        try {
            String quick = answerBasicQuestion(question, crop, district, language);
            if (quick != null) {
                    KisanMitraChatResponse quickResponse = new KisanMitraChatResponse(
                    quick,
                    "Answered from live app data (clock, weather service, mandi listings). For chemical or high-risk decisions consult your local KVK.",
                    language,
                    true,
                    "app-data"
            );
                    recordQuery(question, username, crop, district, language, quickResponse);
                    return quickResponse;
            }
            String answer;
            String source;
            boolean grounded;
            if (hasHostedKey()) {
                answer = callHostedLlm(question, crop, district, language);
                source = resolveProviderName();
                grounded = true;
                    KisanMitraChatResponse response = new KisanMitraChatResponse(
                    answer,
                    "The answer was generated by the external hosted model and should still be checked with your local KVK before applying a treatment or chemical recommendation.",
                    language,
                    grounded,
                    source
            );
                    recordQuery(question, username, crop, district, language, response);
                    return response;
            }
            try {
                answer = callOllama(question, crop, district, language);
                source = "ollama:" + ollamaModel;
                grounded = true;
                    KisanMitraChatResponse response = new KisanMitraChatResponse(
                    answer,
                    "The answer was generated by your local Ollama model and should still be checked with your local KVK before applying a treatment or chemical recommendation.",
                    language,
                    grounded,
                    source
            );
                    recordQuery(question, username, crop, district, language, response);
                    return response;
            } catch (Exception ollamaFailure) {
                answer = buildLocalAnswer(question, crop, district, language);
                    KisanMitraChatResponse response = new KisanMitraChatResponse(
                    answer,
                    "No AI model is reachable (set GEMINI_API_KEY, GROQ_API_KEY, OPENROUTER_API_KEY, or run Ollama locally). This answer uses local West Bengal agronomy knowledge and live mandi data where available. Confirm chemical or high-risk decisions with your local KVK.",
                    language,
                    true,
                    "local-knowledge"
            );
                    recordQuery(question, username, crop, district, language, response);
                    return response;
            }
        } catch (Exception exception) {
                    try {
                        String safe = String.valueOf(exception).replaceAll("key=[^\\s&]+", "key=***");
                        org.slf4j.LoggerFactory.getLogger(KisanMitraService.class)
                                .warn("KisanMitra hosted call failed, using local fallback: {}", safe);
                    } catch (Exception ignored) {
                        // logging must never break the fallback path
                    }
                    String fallback = buildLocalAnswer(question, crop, district, language);
                    KisanMitraChatResponse response = new KisanMitraChatResponse(
                    fallback,
                    "Hosted AI was unavailable, so this answer uses local agronomy knowledge. For urgent crop decisions consult your local KVK.",
                    language,
                    true,
                    "local-knowledge-fallback"
            );
                    recordQuery(question, username, crop, district, language, response);
                    return response;
        }
    }

                private void recordQuery(String question, String username, String crop, String district,
                             String language, KisanMitraChatResponse response) {
                    if (userQueryRepository == null) {
                        return;
                    }
                userQueryRepository.save(new UserQuery(
                    question,
                    username == null || username.isBlank() ? "anonymous" : username,
                    crop,
                    district,
                    language,
                    response.grounded() ? "ANSWERED" : "OFFLINE",
                    response.source()
                ));
                }

    private String callHostedLlm(String question, String crop, String district, String language) throws Exception {
        String activeProvider = resolveProviderName();
        String context = buildContextPrompt(question, crop, district);
        String prompt = "You are KisanMitra, a patient agricultural assistant for smallholder farmers in India. "
                + "Reply in the farmer's language (" + language + "): simple everyday words, short sentences, "
                + "no jargon. If the farmer writes in Hindi or Bengali, answer in that language.\n"
                + "Rules:\n"
                + "1. Give practical step-by-step advice a farmer can do today with locally available inputs.\n"
                + "2. If crop, location, growth stage, symptoms, or soil/weather details are missing and needed, "
                + "ask ONE short follow-up question first instead of guessing.\n"
                + "3. Clearly separate: (a) general farming guidance, (b) AI suggestions that need field verification, "
                + "(c) anything that must be confirmed by the local KVK or agriculture officer.\n"
                + "4. For pesticides or chemicals: always add safety steps (protective covering, correct dilution, "
                + "keep away from children/animals, pre-harvest waiting). Never invent a product name, dosage, "
                + "pre-harvest interval, or re-entry period. If unsure, say so and refer to the KVK.\n"
                + "5. Never claim an image diagnosis or recommendation is certain when confidence is low; "
                + "say what is likely, what else it could be, and what to check next.\n"
                + "6. Use ONLY the live mandi listings below for prices — never hallucinate a price. "
                + "If no listing is given, say the price is not available and suggest checking the mandi section.\n\n"
                + "Farmer question: " + question + "\n\n"
                + context + "\n\n"
                + "Answer concisely in plain language for a farmer, numbered steps where it helps.";

        return switch (activeProvider) {
            case "gemini" -> callGemini(prompt);
            case "groq" -> callGroq(prompt);
            case "openrouter" -> callOpenRouter(prompt);
            default -> throw new IllegalStateException("No supported hosted KisanMitra provider is configured.");
        };
    }

    private String buildContextPrompt(String question, String crop, String district) {
        String districtContext = district != null && !district.isBlank() ? knowledgeBase.getDistrictContext(district) : "Unknown district; use general West Bengal agronomy and ask the farmer to confirm the district.";
        String cropContext = crop != null && !crop.isBlank() ? "Selected crop: " + crop + "." : "Crop not specified by the farmer.";
        StringBuilder context = new StringBuilder();
        context.append("Current context: ").append(districtContext).append(' ').append(cropContext).append('\n');
        if (looksLikePriceQuestion(question) && crop != null && !crop.isBlank()) {
            String prices = livePriceContext(crop, district);
            if (!prices.isBlank()) {
                context.append(prices).append('\n');
            }
        }
        String kvk = kvkContext(district);
        if (!kvk.isBlank()) {
            context.append(kvk).append('\n');
        }
        return context.toString();
    }

    /** Detects "what is the price/rate of X" style questions (English/Hindi/Bengali). */
    private boolean looksLikePriceQuestion(String question) {
        if (question == null) return false;
        String q = question.toLowerCase(Locale.ROOT);
        return q.contains("price") || q.contains("rate") || q.contains("mandi")
                || q.contains("bhav") || q.contains("bazar") || q.contains("bazaar")
                || q.contains("quintal") || q.contains("sell") || q.contains("dam ")
                || q.contains("दाम") || q.contains("भाव") || q.contains("দাম") || q.contains("বাজার");
    }

    /** Live listings from the existing mandi service so the model never invents prices. */
    private String livePriceContext(String crop, String district) {
        if (mandiUpdates == null) return "";
        try {
            Map<String, Object> data = mandiUpdates.getLivePrices(crop, "West Bengal", district, 5);
            if (data == null) return "";
            Object recordsObj = data.get("records");
            if (!(recordsObj instanceof List<?> records) || records.isEmpty()) return "";
            String source = String.valueOf(data.getOrDefault("source", "mandi service"));
            StringBuilder sb = new StringBuilder();
            sb.append("Live mandi listings for ").append(crop).append(" (").append(source).append("): ");
            int count = 0;
            for (Object entry : records) {
                if (!(entry instanceof Map<?, ?> record) || count >= 5) continue;
                if (count > 0) sb.append("; ");
                sb.append(String.valueOf(mapValue(record, "market", "market")))
                        .append(": modal Rs.").append(String.valueOf(mapValue(record, "modalPrice", "?")))
                        .append("/quintal (range Rs.").append(String.valueOf(mapValue(record, "minPrice", "?")))
                        .append("-Rs.").append(String.valueOf(mapValue(record, "maxPrice", "?")))
                        .append(", ").append(String.valueOf(mapValue(record, "date", ""))).append(')');
                count++;
            }
            return count == 0 ? "" : sb.toString();
        } catch (Exception ignored) {
            return "";
        }
    }

    private static Object mapValue(Map<?, ?> map, String key, Object fallback) {
        if (map == null || !map.containsKey(key)) return fallback;
        Object value = map.get(key);
        return value != null ? value : fallback;
    }

    /** Nearest KVK contact so the model can point the farmer to a real expert. */
    private String kvkContext(String district) {
        try {
            Map<String, Object> kvk = knowledgeBase.getKvkDetails(district, null, null);
            if (kvk == null || Boolean.FALSE.equals(kvk.get("available"))) return "";
            return "Nearest KVK for follow-up: " + kvk.getOrDefault("name", "local KVK")
                    + ", phone " + kvk.getOrDefault("phone", "1800-180-1551") + ".";
        } catch (Exception ignored) {
            return "";
        }
    }

    private String callGemini(String prompt) throws Exception {
        String apiKey = geminiApiKey;
        if (apiKey == null || apiKey.isBlank()) {
            throw new IllegalStateException("GEMINI_API_KEY is not configured.");
        }

        Map<String, Object> payload = new LinkedHashMap<>();
        Map<String, Object> content = new LinkedHashMap<>();
        content.put("parts", List.of(Map.of("text", prompt)));
        payload.put("contents", List.of(content));

        // Model names retire often; try current flash models in order.
        List<String> candidates = List.of("gemini-3.8-flash", "gemini-2.5-flash", "gemini-2.5-flash-lite", "gemini-flash-latest");
        Exception lastFailure = null;
        for (String model : candidates) {
            try {
                String rawResponse = restClient.post()
                        .uri("https://generativelanguage.googleapis.com/v1beta/models/" + model + ":generateContent?key=" + apiKey)
                        .contentType(MediaType.APPLICATION_JSON)
                        .body(payload)
                        .retrieve()
                        .body(String.class);

                JsonNode root = objectMapper.readTree(rawResponse);
                JsonNode text = root.path("candidates").path(0).path("content").path("parts").path(0).path("text");
                if (text.isMissingNode() || text.asText().isBlank()) {
                    throw new IllegalStateException("Gemini returned no answer text.");
                }
                return text.asText();
            } catch (Exception attempt) {
                lastFailure = attempt;
            }
        }
        throw new IllegalStateException("All Gemini models failed.", lastFailure);
    }

    private String callGroq(String prompt) throws Exception {
        String apiKey = groqApiKey;
        if (apiKey == null || apiKey.isBlank()) {
            throw new IllegalStateException("GROQ_API_KEY is not configured.");
        }

        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("model", "llama-3.1-8b-instant");
        payload.put("temperature", 0.2);
        payload.put("max_tokens", 500);
        payload.put("messages", List.of(
                Map.of("role", "system", "content", "You are KisanMitra, a safe agricultural assistant. Never invent pesticide dosage, product names, PHI, or REI."),
                Map.of("role", "user", "content", prompt)
        ));

        String rawResponse = restClient.post()
                .uri("https://api.groq.com/openai/v1/chat/completions")
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", "Bearer " + apiKey)
                .body(payload)
                .retrieve()
                .body(String.class);

        JsonNode root = objectMapper.readTree(rawResponse);
        JsonNode text = root.path("choices").path(0).path("message").path("content");
        if (text.isMissingNode() || text.asText().isBlank()) {
            throw new IllegalStateException("Groq returned no answer text.");
        }
        return text.asText();
    }

    private String callOpenRouter(String prompt) throws Exception {
        String apiKey = openRouterApiKey;
        if (apiKey == null || apiKey.isBlank()) {
            throw new IllegalStateException("OPENROUTER_API_KEY is not configured.");
        }

        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("model", "openai/gpt-4o-mini");
        payload.put("temperature", 0.2);
        payload.put("messages", List.of(
                Map.of("role", "system", "content", "You are KisanMitra, a safe agricultural assistant for Indian farmers. Never invent a pesticide dosage, product name, PHI, or REI. Refer to local KVK if the answer is uncertain."),
                Map.of("role", "user", "content", prompt)
        ));

        String rawResponse = restClient.post()
                .uri("https://openrouter.ai/api/v1/chat/completions")
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", "Bearer " + apiKey)
                .header("HTTP-Referer", "https://fasalsathi.local")
                .header("X-Title", "FasalSathi KisanMitra")
                .body(payload)
                .retrieve()
                .body(String.class);

        JsonNode root = objectMapper.readTree(rawResponse);
        JsonNode text = root.path("choices").path(0).path("message").path("content");
        if (text.isMissingNode() || text.asText().isBlank()) {
            throw new IllegalStateException("OpenRouter returned no answer text.");
        }
        return text.asText();
    }

    /** Keyless local model (Ollama OpenAI-compatible chat endpoint, non-streaming). */
    private String callOllama(String question, String crop, String district, String language) throws Exception {
        String model = ollamaModel != null && !ollamaModel.isBlank() ? ollamaModel.trim() : "qwen2.5:3b";
        String base = ollamaUrl != null && !ollamaUrl.isBlank() ? ollamaUrl.trim().replaceAll("/+$", "") : "http://localhost:11434";
        String context = buildContextPrompt(question, crop, district);
        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("model", model);
        payload.put("stream", false);
        payload.put("options", Map.of("temperature", 0.3, "num_predict", 450));
        payload.put("messages", List.of(
                Map.of("role", "system", "content", "You are KisanMitra, a patient farming assistant for smallholder farmers in West Bengal, India. Reply in the farmer's language (" + language + ") with simple words and short sentences. Never invent pesticide product names, dosages, market prices, or weather readings. If unsure, say so and refer to the local KVK."),
                Map.of("role", "user", "content", "Farmer question: " + question + "\n\n" + context)
        ));

        String rawResponse = restClient.post()
                .uri(base + "/api/chat")
                .contentType(MediaType.APPLICATION_JSON)
                .body(payload)
                .retrieve()
                .body(String.class);

        JsonNode root = objectMapper.readTree(rawResponse);
        JsonNode text = root.path("message").path("content");
        if (text.isMissingNode() || text.asText().isBlank()) {
            throw new IllegalStateException("Ollama returned no answer text.");
        }
        return text.asText().trim();
    }

    /**
     * Answers basic non-farming questions directly from live app data so the
     * chatbot responds to greetings, time, weather, price, and help prompts.
     * Returns null when the question needs the AI model or agronomy template.
     */
    private String answerBasicQuestion(String question, String crop, String district, String language) {
        String q = question == null ? "" : question.trim().toLowerCase(Locale.ROOT);
        if (q.isEmpty()) return null;
        if (isGreeting(q)) return greetingAnswer(language, district);
        if (isTimeQuestion(q)) return timeAnswer(language);
        if (isWeatherQuestion(q)) return weatherAnswer(district, language);
        if (looksLikePriceQuestion(question)) return priceAnswer(crop, district, language);
        if (isHelpQuestion(q)) return helpAnswer(language);
        return null;
    }

    private boolean isGreeting(String q) {
        return q.matches("^(hi+|hello+|hey+|namaste|namaskar|pranam|namoskar|নমস্কার|হ্যালো|हैलो|नमस्ते|good morning|good afternoon|good evening|suprabhat|সুপ্রভাত|सुप्रभात)[!.\\s]*$");
    }

    private boolean isTimeQuestion(String q) {
        return q.contains("what time") || q.contains("current time") || q.contains("time now")
                || q.contains("samay") || q.contains("somoy") || q.contains("সময়") || q.contains("समय")
                || q.matches(".*\\btime\\b.*") && (q.contains("now") || q.contains("today"));
    }

    private boolean isWeatherQuestion(String q) {
        return q.contains("weather") || q.contains("mausam") || q.contains("mosam") || q.contains("maosam")
                || q.contains("barish") || q.contains("brishti") || q.contains("barsaat")
                || q.contains("বৃষ্টি") || q.contains("আবহাওয়া") || q.contains("আবহাওয়া")
                || q.contains("मौसम") || q.contains("बारिश") || q.contains("temperature") || q.contains("tapman")
                || q.contains("rain") || q.contains("humidity");
    }

    private boolean isHelpQuestion(String q) {
        return q.contains("who are you") || q.contains("what can you do") || q.contains("help me")
                || q.equals("help") || q.contains("tum kaun") || q.contains("tumi ke");
    }

    private String greetingAnswer(String language, String district) {
        String place = district != null && !district.isBlank() ? " from " + district : "";
        return switch (language) {
            case "bn" -> "নমস্কার! আমি কিষানমিত্র। ফসল, সেচ, মাটি, আবহাওয়া, বাজারদর বা রোগ সম্পর্কে জিজ্ঞাসা করুন। যেমন: \"আজকের আবহাওয়া কেমন?\"";
            case "hi" -> "नमस्ते! मैं किसानमित्र हूँ। फसल, सिंचाई, मिट्टी, मौसम, मंडी भाव या रोग के बारे में पूछें। जैसे: \"आज का मौसम कैसा है?\"";
            default -> "Hello! I am KisanMitra, your farming assistant" + place + ". Ask me about crops, irrigation, soil, today's weather, mandi prices, or plant problems. Try: \"What's the weather today?\"";
        };
    }

    private String timeAnswer(String language) {
        java.time.ZonedDateTime now = java.time.ZonedDateTime.now(java.time.ZoneId.of("Asia/Kolkata"));
        String clock = now.format(java.time.format.DateTimeFormatter.ofPattern("hh:mm a"));
        String day = now.format(java.time.format.DateTimeFormatter.ofPattern("EEEE, dd MMMM yyyy"));
        return switch (language) {
            case "bn" -> "এখন ভারতীয় সময় " + clock + " (" + day + ")।";
            case "hi" -> "अभी भारतीय समय " + clock + " (" + day + ") है।";
            default -> "Right now it is " + clock + " IST (" + day + ").";
        };
    }

    private String weatherAnswer(String district, String language) {
        Double lat = null;
        Double lon = null;
        if (district != null && !district.isBlank()) {
            WBCropKnowledgeBase.DistrictInfo info = knowledgeBase.getDistrict(district);
            if (info != null) {
                lat = info.latitude();
                lon = info.longitude();
            }
        }
        Map<String, Object> weather;
        try {
            weather = weatherService.getLiveWeather(lat, lon);
        } catch (Exception ignored) {
            return switch (language) {
                case "bn" -> "এখন আবহাওয়ার তথ্য পাওয়া যাচ্ছে না। হোম পেজের আবহাওয়া ট্যাব দেখুন।";
                case "hi" -> "अभी मौसम की जानकारी नहीं मिल सकी। होम पेज का मौसम टैब देखें।";
                default -> "I could not fetch the weather right now. Check the Weather tab on the home page.";
            };
        }
        String place = district != null && !district.isBlank() ? district : String.valueOf(weather.getOrDefault("district", "your area"));
        String line = "Weather in " + place + ": " + weather.getOrDefault("condition", "—")
                + ", " + weather.getOrDefault("temperatureC", "?") + "°C"
                + ", humidity " + weather.getOrDefault("humidityPercent", "?") + "%"
                + ", rain " + weather.getOrDefault("rainMm", "?") + " mm"
                + ", wind " + weather.getOrDefault("windKph", "?") + " km/h.";
        double rain = toDouble(weather.get("rainMm"));
        String advice = rain > 5 ? " Rain is expected — avoid irrigation and spraying, keep harvested produce covered."
                : " Good fieldwork window — check soil moisture before irrigating.";
        return switch (language) {
            case "bn" -> place + "-এর আবহাওয়া: " + weather.getOrDefault("condition", "—")
                    + ", " + weather.getOrDefault("temperatureC", "?") + "°সে, আর্দ্রতা "
                    + weather.getOrDefault("humidityPercent", "?") + "%, বৃষ্টি "
                    + weather.getOrDefault("rainMm", "?") + " মিমি।" + advice;
            case "hi" -> place + " का मौसम: " + weather.getOrDefault("condition", "—")
                    + ", " + weather.getOrDefault("temperatureC", "?") + "°से, नमी "
                    + weather.getOrDefault("humidityPercent", "?") + "%, बारिश "
                    + weather.getOrDefault("rainMm", "?") + " मिमी।" + advice;
            default -> line + advice;
        };
    }

    private String priceAnswer(String crop, String district, String language) {
        if (crop == null || crop.isBlank()) {
            return switch (language) {
                case "bn" -> "কোন ফসলের দাম জানতে চান? উপরে ফসল বেছে আবার জিজ্ঞাসা করুন।";
                case "hi" -> "किस फसल का भाव जानना चाहते हैं? ऊपर फसल चुनकर फिर पूछें।";
                default -> "Which crop's price do you want? Select the crop above and ask again.";
            };
        }
        String prices = livePriceContext(crop, district);
        if (prices.isBlank()) {
            return switch (language) {
                case "bn" -> crop + "-এর লাইভ দাম এখন পাওয়া যাচ্ছে না। হোম পেজের বাজারদর ট্যাব দেখুন বা বিক্রির আগে মান্ডিতে নিশ্চিত করুন।";
                case "hi" -> crop + " का लाइव भाव अभी उपलब्ध नहीं है। होम पेज का बाज़ार भाव टैब देखें या बेचने से पहले मंडी में पुष्टि करें।";
                default -> "Live price for " + crop + " is not available right now. Check the Market prices tab, and confirm at the mandi before selling.";
            };
        }
        return switch (language) {
            case "bn" -> prices + " বিক্রির আগে মান্ডিতে দাম নিশ্চিত করুন।";
            case "hi" -> prices + " बेचने से पहले मंडी में भाव की पुष्टि करें।";
            default -> prices + " Confirm at the mandi before selling.";
        };
    }

    private String helpAnswer(String language) {
        return switch (language) {
            case "bn" -> "আমি ফসল, সেচ, সার, মাটি, পোকা-রোগ, আজকের আবহাওয়া, এখনকার সময় ও বাজারদরে সাহায্য করি। গুরুত্বপূর্ণ সিদ্ধান্তে স্থানীয় KVK-এর সঙ্গে যাচাই করুন।";
            case "hi" -> "मैं फसल, सिंचाई, खाद, मिट्टी, कीट-रोग, आज का मौसम, अभी का समय और मंडी भाव में मदद करता हूँ। ज़रूरी फैसलों में स्थानीय KVK से पुष्टि करें।";
            default -> "I can help with crops, irrigation, fertilizer, soil, pests and disease, today's weather, the current time, and mandi prices. For pesticide or high-risk decisions, always confirm with your local KVK.";
        };
    }

    private double toDouble(Object value) {
        if (value instanceof Number number) return number.doubleValue();
        try {
            return Double.parseDouble(String.valueOf(value));
        } catch (Exception ignored) {
            return 0.0;
        }
    }

    private boolean hasHostedKey() {
        return (geminiApiKey != null && !geminiApiKey.isBlank())
                || (groqApiKey != null && !groqApiKey.isBlank())
                || (openRouterApiKey != null && !openRouterApiKey.isBlank());
    }

    private String buildLocalAnswer(String question, String crop, String district, String language) {
        String districtContext = (district != null && !district.isBlank())
                ? knowledgeBase.getDistrictContext(district)
                : "West Bengal general guidance. Select your district on the home page for precise advice.";
        String cropLine = (crop != null && !crop.isBlank()) ? "Crop: " + crop + "." : "Crop not specified.";
        String prices = (crop != null && !crop.isBlank()) ? livePriceContext(crop, district) : "";
        if (prices.isBlank()) prices = "Live mandi price is not available right now. Check the Market prices tab before selling.";
        String kvk = kvkContext(district);
        if (kvk.isBlank()) kvk = "For urgent decisions contact your local KVK or Kisan Call Centre 1800-180-1551.";
        String q = question == null ? "" : question.trim();
        String prefix = "en".equals(language) ? "" : ("[" + language + "] ");
        return prefix + "Based on local knowledge for " + cropLine + " " + districtContext
                + "\n\n1. Your question: " + q
                + "\n2. What to do today: check leaves (top and underside), check soil moisture 5 cm deep, and remove any badly infected leaves."
                + "\n3. Water only if soil is dry; avoid spraying before rain."
                + "\n4. " + prices
                + "\n5. " + kvk
                + "\n\nWatch for: spreading spots, wilting, or pests on new growth. If it spreads fast, take a clear leaf photo to Diagnose and visit the KVK."
                + " What is your crop stage and when did the symptom start?";
    }

    private String resolveProviderName() {
        if (provider != null && !provider.isBlank()) {
            String normalized = provider.trim().toLowerCase(Locale.ROOT);
            if (normalized.equals("groq") && groqApiKey != null && !groqApiKey.isBlank()) return "groq";
            if (normalized.equals("openrouter") && openRouterApiKey != null && !openRouterApiKey.isBlank()) return "openrouter";
            if (normalized.equals("gemini") && geminiApiKey != null && !geminiApiKey.isBlank()) return "gemini";
        }

        if (geminiApiKey != null && !geminiApiKey.isBlank()) return "gemini";
        if (groqApiKey != null && !groqApiKey.isBlank()) return "groq";
        if (openRouterApiKey != null && !openRouterApiKey.isBlank()) return "openrouter";
        return "gemini";
    }
}
