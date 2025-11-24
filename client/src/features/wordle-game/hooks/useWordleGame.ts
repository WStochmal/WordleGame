// --- lib ---
import { useEffect, useRef, useState } from "react";

//  --- hooks ---
import { useApiMutation } from "@/api/hooks/useApiMutation";
import { wordleGameApi } from "@/features/wordle-game/api/wordleGame.api";

// --- types ---
import type { ApiResponse } from "@/types/apiResponse.type";
import type {
  GuessResponse,
  GuessResultProps,
} from "@/features/wordle-game/types/wordleGame.type";

export const useWordleGame = () => {
  console.log("useWordleGame");
  const [wordsGuesses, setWordsGuesses] = useState<GuessResultProps[]>([]);
  const [wordGuess, setWordGuess] = useState("");
  const [errorRow, setErrorRow] = useState<number | null>(null);

  const wordsGuessesRef = useRef(wordsGuesses);
  const wordGuessRef = useRef(wordGuess);

  const [modalData, setModalData] = useState<
    Partial<{
      visible: boolean;
      message: string;
      type: "success" | "error";
      autoHideMs?: number;
    }>
  >({
    visible: false,
    message: "",
    type: "success",
    autoHideMs: 0,
  });

  // --- Start game ---
  const startGame = useApiMutation<ApiResponse<void>, void>(
    () => wordleGameApi.start(),
    () =>
      setModalData({
        visible: true,
        message: "Game started successfully!",
        type: "success",
        autoHideMs: 500,
      }),
    () =>
      setModalData({
        visible: true,
        message: "Error starting the game.",
        type: "error",
      })
  );

  useEffect(() => {
    startGame.mutate();
  }, []);

  useEffect(() => {
    wordsGuessesRef.current = wordsGuesses;
  }, [wordsGuesses]);

  useEffect(() => {
    wordGuessRef.current = wordGuess;
  }, [wordGuess]);

  // --- Guess word mutation ---
  const checkWord = useApiMutation<ApiResponse<GuessResponse>, string>(
    (guess) => wordleGameApi.guess(guess),
    (response) => {
      const newGuess: GuessResultProps = {
        guess: wordGuess,
        guessLettersCheck: response.data.letters,
      };

      setWordsGuesses((prev) => [...prev, newGuess]);
      setWordGuess("");

      if (response.data.gameOver) {
        setModalData({
          visible: true,
          message: response.data.correct
            ? `🥳 You won! You've guessed ${response.data.targetWord}`
            : `🙁 Game over! The word was ${response.data.targetWord}`,
          type: response.data.correct ? "success" : "error",
        });
      }
    },
    (error) => console.error("Guess error:", error)
  );

  // --- Key coloring logic ---
  const keyStatus: Record<string, "correct" | "present" | "absent"> = {};

  wordsGuesses.forEach((row) => {
    row.guessLettersCheck.forEach((l) => {
      const letter = l.letter.toLowerCase();

      if (l.status === "correct") keyStatus[letter] = "correct";
      else if (l.status === "present" && keyStatus[letter] !== "correct")
        keyStatus[letter] = "present";
      else if (!keyStatus[letter]) keyStatus[letter] = "absent";
    });
  });

  return {
    wordGuess,
    setWordGuess,
    wordsGuesses,
    errorRow,
    setErrorRow,
    checkWord,
    modalData,
    setModalData,
    keyStatus,
    startGame,
    wordGuessRef,
    wordsGuessesRef,
  };
};
