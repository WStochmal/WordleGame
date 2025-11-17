export type LetterStatus = "correct" | "present" | "absent";

export interface LetterCheck {
  letter: string;
  status: LetterStatus;
}

export type GuessFeedback = LetterStatus[];

export interface GuessResponse {
  correct: boolean;
  gameOver: boolean;
  targetWord?: string | null;
  letters: LetterCheck[];
}

export type GuessResultProps = {
  guess: string;
  guessLettersCheck: LetterCheck[];
};
