package com.app.dto.game;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LetterCheck {
    private char letter;
    private String status; // "correct", "present", "absent"
}
