/// --- lib ---
import React, { useEffect, useRef, useState } from "react";

// --- components ---
import TableLine from "./components/TableLine/TableLine";

// --- api ---
import { wordleGameApi } from "../../api/wordleGame.api";

// --- hooks ---
import { useApiMutation } from "../../../../api/hooks/useApiMutation";

// --- types ---
import type { GuessResponse } from "../../types/wordleGame.type";
import type { ApiResponse } from "../../../../types/apiResponse.type";
import type { GuessResultProps } from "../../types/wordleGame.type";
import GameModal from "./components/GameModal/GameModal";

const NUMBER_OF_ROWS = 6;

const WordleGame = () => {
  const [wordsGuesses, setWordsGuesses] = useState<GuessResultProps[]>([]);
  const [wordGuess, setWordGuess] = useState<string>("");
  const [errorRow, setErrorRow] = useState<number | null>(null);
  const wordsGuessesRef = useRef<GuessResultProps[]>(wordsGuesses);
  const wordGuessRef = useRef<string>(wordGuess);
  const modalRef = useRef<HTMLDivElement>(null);

  const [modalData, setModalData] = useState<{
    visible: boolean;
    message: string;
    type: "success" | "error";
    autoHideMs?: number;
  }>({ visible: false, message: "", type: "success" });

  const startGame = useApiMutation<ApiResponse<void>, void>(
    () => wordleGameApi.start(),
    () => {
      setModalData({
        visible: true,
        message: "Game started successfully!",
        type: "success",
        autoHideMs: 500,
      });
    },
    () => {
      setModalData({
        visible: true,
        message: "Error starting the game. Please try again later.",
        type: "error",
      });
    }
  );

  // --- Start game on component mount ---
  useEffect(() => {
    startGame.mutate();
  }, []);

  // --- Save wordGuess in ref to access it in event listener ---
  useEffect(() => {
    wordGuessRef.current = wordGuess;
  }, [wordGuess]);

  // --- Save wordsGuesses in ref to access it in event listener ---
  useEffect(() => {
    wordsGuessesRef.current = wordsGuesses;
  }, [wordsGuesses]);

  // --- Mount / unmount keydown event listener ---
  useEffect(() => {
    if (!startGame.isSuccess) return;
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [startGame.isSuccess]);

  // --- Handle keydown events ---
  const handleKeyDown = (e: KeyboardEvent) => {
    if (!startGame.isSuccess) return;
    const currentWord = wordGuessRef.current;

    if (e.key.length === 1 && /^[a-z]$/i.test(e.key)) {
      if (currentWord.length >= 5) {
        setErrorRow(wordsGuessesRef.current.length);
        setTimeout(() => setErrorRow(null), 500);
      }
      setWordGuess((prev) =>
        prev.length < 5 ? prev + e.key.toUpperCase() : prev
      );
    } else if (e.key === "Backspace") {
      setWordGuess((prev) => prev.slice(0, -1));
    } else if (e.key === "Enter") {
      if (currentWord.length === 5) {
        checkWord.mutate(currentWord);
      } else {
        setErrorRow(wordsGuessesRef.current.length);
        setTimeout(() => setErrorRow(null), 500);
      }
    }
  };

  // --- Check word guess ---
  const checkWord = useApiMutation<ApiResponse<GuessResponse>, string>(
    (guess) => wordleGameApi.guess(guess),
    (response) => {
      const newGuess = {
        guess: wordGuess,
        guessLettersCheck: response.data.letters,
      };

      setWordsGuesses((prev) => [...prev, newGuess]);
      setWordGuess("");

      console.log(response);
      if (response.data.gameOver) {
        setModalData({
          visible: true,
          message: response.data.correct
            ? `🥳 You won! You've guessed ${response.data.targetWord}`
            : "🙁 Game over! The word was " + response.data.targetWord,
          type: response.data.correct ? "success" : "error",
          autoHideMs: undefined,
        });
      }
    },
    (error) => {
      console.error("Error while checking guess:", error);
    }
  );

  return (
    <div>
      <GameModal
        isVisible={modalData.visible}
        message={modalData.message}
        type={modalData.type}
        autoHideMs={modalData.autoHideMs}
        onHide={() => setModalData((prev) => ({ ...prev, visible: false }))}
      />

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
