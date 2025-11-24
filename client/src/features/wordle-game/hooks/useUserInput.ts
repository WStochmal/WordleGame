// --- lib ---
import { useEffect } from "react";

// --- types ---
type UseUserInputParams = {
  setWordGuess: (fn: (prev: string) => string) => void;
  wordGuessRef: React.RefObject<string>;
  wordsGuessesRef: React.RefObject<any[]>;
  setErrorRow: (row: number | null) => void;
  checkWord: { mutate: (word: string) => void };
  startGameSuccess: boolean;
};

export const useUserInput = ({
  setWordGuess,
  wordGuessRef,
  wordsGuessesRef,
  setErrorRow,
  checkWord,
  startGameSuccess,
}: UseUserInputParams) => {
  // --- Handle virtual keypress ---
  const handleVirtualKeyPress = (key: string) => {
    const currentWord = wordGuessRef.current;

    if (/^[a-z]$/.test(key)) {
      if (currentWord.length >= 5) {
        setErrorRow(wordsGuessesRef.current.length);
        setTimeout(() => setErrorRow(null), 500);
        return;
      }
      setWordGuess((prev) => prev + key.toUpperCase());
      return;
    }

    if (key === "backspace") {
      setWordGuess((prev) => prev.slice(0, -1));
      return;
    }

    if (key === "enter") {
      if (currentWord.length === 5) {
        checkWord.mutate(currentWord);
      } else {
        setErrorRow(wordsGuessesRef.current.length);
        setTimeout(() => setErrorRow(null), 500);
      }
    }
  };

  // --- keydown syncs with virtual handling ---
  useEffect(() => {
    if (!startGameSuccess) return;

    const handler = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();

      if (key === "backspace") handleVirtualKeyPress("backspace");
      else if (key === "enter") handleVirtualKeyPress("enter");
      else if (/^[a-z]$/.test(key)) handleVirtualKeyPress(key);
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [startGameSuccess]);

  return { handleVirtualKeyPress };
};
