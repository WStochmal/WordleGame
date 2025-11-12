package com.app.controller;


import com.app.dto.ResponseDto;
import com.app.dto.game.GuessRequest;
import com.app.dto.game.GuessResponse;
import com.app.service.WordleGameService;
import jakarta.servlet.http.HttpSession;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/wordle-game")
// http://localhost:8080/api/wordle-game/start”
@AllArgsConstructor
@CrossOrigin(
        origins = "http://localhost:5173",
        allowCredentials = "true"
)
public class WordleGameController {

    private final WordleGameService wordleGameService;

    @PostMapping("/start")
    public ResponseEntity<ResponseDto<Void>> start(HttpSession session) {
       return  wordleGameService.startNewGame(session);
    }

    @PostMapping("/guess")
    public ResponseEntity<ResponseDto<GuessResponse>> makeGuess(@RequestBody GuessRequest guess, HttpSession session) {
        return wordleGameService.processGuess(guess, session);
    }
}
