package com.app.dto.game;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GuessResponse {
    private boolean isCorrect;
    private boolean gameOver;
    private List<LetterCheck> letters;
}
