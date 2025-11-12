package com.app.config;

import com.app.model.Word;
import com.app.repository.WordsRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import jakarta.annotation.PostConstruct;
import lombok.AllArgsConstructor;
import org.springframework.context.annotation.Configuration;
import java.io.InputStream;
import java.util.List;
import java.util.UUID;

@Configuration
@AllArgsConstructor
public class DataLoader {

    private final WordsRepository wordsRepository;

    @PostConstruct
    public void loadWords(){
        try {
            ObjectMapper mapper = new ObjectMapper();
            mapper.registerModule(new JavaTimeModule());

            // 1. Load JSON file from resources
            InputStream inputStream = getClass().getResourceAsStream("/words.json");
            if (inputStream == null) {
                throw new IllegalArgumentException("File not found: /words.json");
            }
            // 2. Parse JSON to List<Invoice>
            List<String> words = mapper.readValue(inputStream, new TypeReference<List<String>>() {});

            for (String w : words) {
                Word word = new Word();
                word.setId(UUID.randomUUID());
                word.setWord(w.toUpperCase());
                wordsRepository.save(word);
            }

            System.out.println("Words loaded: " + words.size());

        } catch (Exception e){
            e.printStackTrace();
        }
    }
}

