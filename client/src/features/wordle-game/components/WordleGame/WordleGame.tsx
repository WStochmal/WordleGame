/// --- lib ---
import React, { use, useEffect, useState } from "react";

// --- components ---
import TableLine from "./components/TableLine/TableLine";

// --- styles ---
import style from "./WordleGame.module.scss";

// --- api ---
import { wordleGameApi } from "../../api/wordleGame.api";

// --- hooks ---
import { useApiMutation } from "../../../../api/hooks/useApiMutation";

// --- types ---
import type { GuessResponse } from "../../types/wordleGame.type";
import type { ApiResponse } from "../../../../types/apiResponse.type";
import type { GuessResultProps } from "../../types/wordleGame.type";

const NUMBER_OF_ROWS = 6;

const WordleGame = () => {
  const [wordsGuesses, setWordsGuesses] = useState<GuessResultProps[]>([]);
  const [wordGuess, setWordGuess] = useState<string>("");
  const [errorRow, setErrorRow] = useState<number | null>(null);

  const startGame = useApiMutation<ApiResponse<void>, void>(
    () => wordleGameApi.start(),
    (response) => {
      if (response.success) {
        console.log("Game started successfully");
      } else {
        console.error("Failed to start game");
      }
    }
  );

  const checkWord = useApiMutation<ApiResponse<GuessResponse>, string>(
    (guess) => wordleGameApi.guess(guess),
    (response) => {
      console.log("Guess checked:", response);
      const newGuess = {
        guess: wordGuess,
        guessLettersCheck: response.data.letters,
      };

      setWordsGuesses((prev) => [...prev, newGuess]);
      setWordGuess("");

      if (response.data.gameOver) {
        console.log(
          response.data.isCorrect ? "🎉 You won!" : "💀 Game over. Try again!"
        );
      }
    },
    (error) => {
      console.error("Error while checking guess:", error);
    }
  );

  useEffect(() => {
    startGame.mutate();
  }, []);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key.length === 1 && e.key.match(/^[a-z]$/i)) {
      if (wordGuess.length >= 5) {
        setErrorRow(wordsGuesses.length);
        setTimeout(() => {
          setErrorRow(null);
        }, 500);
      }
      setWordGuess((prev) =>
        prev.length < 5 ? prev + e.key.toUpperCase() : prev
      );
    } else if (e.key === "Backspace") {
      setWordGuess((prev) => prev.slice(0, -1));
    } else if (e.key === "Enter") {
      if (wordGuess.length === 5) {
        checkWord.mutate(wordGuess);
      } else {
        setErrorRow(wordsGuesses.length);
        setTimeout(() => setErrorRow(null), 500);
      }
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [wordGuess]);

  return (
    <div className={style["table"]}>
      {[...Array(NUMBER_OF_ROWS)].map((row, rowIndex) => {
        const isCurrentRow = rowIndex === wordsGuesses.length;

        return (
          <TableLine
            key={rowIndex}
            word={
              isCurrentRow ? wordGuess : wordsGuesses[rowIndex]?.guess || ""
            }
            feedback={
              !isCurrentRow
                ? wordsGuesses[rowIndex]?.guessLettersCheck
                : undefined
            }
            hasError={errorRow === rowIndex}
          />
        );
      })}
    </div>
  );
};

export default WordleGame;
