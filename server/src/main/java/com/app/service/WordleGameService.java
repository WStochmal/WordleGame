package com.app.service;


import com.app.dto.ResponseDto;
import com.app.dto.game.GuessRequest;
import com.app.dto.game.GuessResponse;
import com.app.dto.game.LetterCheck;
import com.app.model.Word;
import com.app.repository.WordsRepository;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;



@Service
@RequiredArgsConstructor
public class WordleGameService {

    private final WordsRepository wordsRepository;
    private final Random random = new Random();
    private static final int MAX_ATTEMPTS = 6;


    public ResponseEntity<ResponseDto<Void>> startNewGame(HttpSession session) {

        System.out.println("Starting a new Wordle game session: " + session);

        String newWord = generateRandomWord();
        session.setAttribute("wordleWord", newWord);
        session.setAttribute("attempts", 0);

        ResponseDto<Void> responseDto = new ResponseDto<>(true, null);
        return ResponseEntity.ok(responseDto);
    }

    private String generateRandomWord() {
        List<Word> allWords = wordsRepository.findAll();
        if (allWords.isEmpty()) {
            throw new IllegalStateException("No words available in the repository");
        }
        return allWords.get(random.nextInt(allWords.size())).getWord().toUpperCase();
    }


    public ResponseEntity<ResponseDto<GuessResponse>> processGuess(GuessRequest guess, HttpSession session) {
        String targetWordAttr = (String) session.getAttribute("wordleWord");
        Integer attempts = (Integer) session.getAttribute("attempts");

        System.out.println("Processing guess: " + guess.getGuess() + " for session: " + session + " Target word: " + targetWordAttr + " Attempts: " + attempts);


        if (targetWordAttr == null || attempts == null) {
            return ResponseEntity
                    .badRequest()
                    .body(new ResponseDto<>(false, null));
        }

        String target = targetWordAttr.toUpperCase();

        attempts++;
        session.setAttribute("attempts", attempts);

        List<LetterCheck> result = new ArrayList<>();



            for (int i = 0; i < guess.getGuess().length(); i++) {
                char letter = guess.getGuess().charAt(i);
                if (letter == target.charAt(i)) {
                    result.add(new LetterCheck(letter, "correct"));
                } else if (target.indexOf(letter) != -1) {
                    result.add(new LetterCheck(letter, "present"));
                } else {
                    result.add(new LetterCheck(letter, "absent"));
                }
            }


        boolean isCorrect = guess.getGuess().equalsIgnoreCase(target);
        boolean gameOver = isCorrect || attempts >= MAX_ATTEMPTS;



        if (gameOver) {
            session.invalidate();
        }

        GuessResponse response = new GuessResponse(isCorrect, gameOver, result);

        return ResponseEntity.ok(new ResponseDto<>(true, response));
    }
}


