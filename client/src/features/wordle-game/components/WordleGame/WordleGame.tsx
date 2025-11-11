import React, { useEffect, useState } from "react";
import TableLine from "./components/TableLine/TableLine";

import style from "./WordleGame.module.scss";

const NUMBER_OF_ROWS = 6;
const WORD = "APPLE";

type LetterStatus = "correct" | "present" | "absent";

type GuessResultProps = {
  guess: string;
  guessLettersCheck: Record<string, LetterStatus>[];
};

const WordleGame = () => {
  const [wordsGuesses, setWordsGuesses] = useState<GuessResultProps[]>([]);
  const [wordGuess, setWordGuess] = useState<string>("");
  const [errorRow, setErrorRow] = useState<number | null>(null);

  const checkGuess = (wordGuess: string, targetWord: string) => {
    console.log(
      "Checking guess:",
      wordGuess,
      "against target word:",
      targetWord
    );
    const result: Record<string, LetterStatus>[] = [];

    for (let i = 0; i < wordGuess.length; i++) {
      const letter = wordGuess[i].toUpperCase();

      if (letter === targetWord[i]) {
        result.push({ [letter]: "correct" });
      } else if (targetWord.includes(letter)) {
        result.push({ [letter]: "present" });
      } else {
        result.push({ [letter]: "absent" });
      }
    }

    return result;
  };

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
      console.log("Submitting word guess:", wordGuess);
      if (wordGuess.length === 5) {
        const guessLettersCheck = checkGuess(wordGuess, WORD);
        const newGuess: GuessResultProps = {
          guess: wordGuess,
          guessLettersCheck,
        };

        setWordsGuesses((prev) => [...prev, newGuess]);
        setWordGuess("");
      } else {
        setErrorRow(wordsGuesses.length);
        setTimeout(() => {
          setErrorRow(null);
        }, 500);
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
