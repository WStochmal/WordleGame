import WordleGame from "@/features/wordle-game/components/WordleGame/WordleGame";

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
