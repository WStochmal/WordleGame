// --- components ---
import type { LetterCheck } from "../../../../types/wordleGame.type";

// --- style ---
import style from "./TableCell.module.scss";

// --- types ---
type TableCellProps = {
  char?: string;
  feedback?: LetterCheck;
};

const TableCell = ({ char, feedback }: TableCellProps) => {
  const letter = feedback?.letter ?? char ?? "";
  const status = feedback?.status;

  return (
    <div
      className={`${style["table-cell"]} ${status ? style[status] : ""} ${
        letter ? style["filled"] : ""
      }`}
    >
      {letter}
    </div>
  );
};

export default TableCell;
