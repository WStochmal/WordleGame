// --- components ---
import WordleGame from "@/features/wordle-game/WordleGame";

// --- style ---
import style from "./WordleGamePage.module.scss";

const WordleGamePage = () => {
  return (
    <div className={style["page-container"]}>
      <WordleGame />
    </div>
  );
};

export default WordleGamePage;
