// --- Assets ---
import keys from "@/features/wordle-game/assets/keyboard.json";

// --- Styles ---
import style from "./Keyboard.module.scss";

// --- Types ---
type KeyboardProps = {
  onKeyPress: (key: string) => void;
  keyStatus: Record<string, "correct" | "present" | "absent">;
};

const Keyboard = ({ onKeyPress, keyStatus }: KeyboardProps) => {
  // --- Keyboard rows ---
  const row1 = keys.slice(0, 10); // q – p
  const row2 = keys.slice(10, 19); // a – backspace
  const row3 = keys.slice(19); // z – enter

  const renderRow = (row: string[]) => (
    <div className={style.row}>
      {row.map((key) => (
        <button
          key={key}
          className={`${style["key-block"]} ${
            style[key !== "backspace" && key !== "enter" ? "letter" : "fnKey"]
          } ${keyStatus[key.toLowerCase()] ? style["used-key"] : ""}`}
          onClick={() => onKeyPress(key)}
        >
          {key}
        </button>
      ))}
    </div>
  );

  return (
    <div className={style.keyboard}>
      {renderRow(row1)}
      {renderRow(row2)}
      {renderRow(row3)}
    </div>
  );
};

export default Keyboard;
