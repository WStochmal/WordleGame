// --- components ---
import TableLine from "./components/TableLine/TableLine";
import GameModal from "./components/GameModal/GameModal";
import Keyboard from "./components/Keyboard/Keyboard";

// --- hooks ---
import { useWordleGame } from "./hooks/useWordleGame";
import { useUserInput } from "./hooks/useUserInput";

const NUMBER_OF_ROWS = 6;

const WordleGame = () => {
  const game = useWordleGame();

  const { handleVirtualKeyPress } = useUserInput({
    setWordGuess: game.setWordGuess,
    wordGuessRef: game.wordGuessRef,
    wordsGuessesRef: game.wordsGuessesRef,
    setErrorRow: game.setErrorRow,
    checkWord: game.checkWord,
    startGameSuccess: game.startGame.isSuccess,
  });

  return (
    <div>
      <GameModal
        isVisible={game.modalData.visible}
        message={game.modalData.message}
        type={game.modalData.type}
        autoHideMs={game.modalData.autoHideMs}
        onHide={() => game.setModalData((p) => ({ ...p, visible: false }))}
      />

      {[...Array(NUMBER_OF_ROWS)].map((_, rowIndex) => {
        const isCurrentRow = rowIndex === game.wordsGuesses.length;

        return (
          <TableLine
            key={rowIndex}
            word={
              isCurrentRow
                ? game.wordGuess
                : game.wordsGuesses[rowIndex]?.guess || ""
            }
            feedback={
              !isCurrentRow
                ? game.wordsGuesses[rowIndex]?.guessLettersCheck
                : undefined
            }
            hasError={game.errorRow === rowIndex}
          />
        );
      })}

      <Keyboard onKeyPress={handleVirtualKeyPress} keyStatus={game.keyStatus} />
    </div>
  );
};

export default WordleGame;
