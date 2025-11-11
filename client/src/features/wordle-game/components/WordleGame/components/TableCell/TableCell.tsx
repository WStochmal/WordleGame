// --- type ---
type TableCellProps = {
  char?: string;
  feedback?: Record<string, "correct" | "present" | "absent">;
};

// --- style ---
import style from "./TableCell.module.scss";

const TableCell = ({ char, feedback }: TableCellProps) => {
  return (
    <div
      className={`${style["table-cell"]} ${
        feedback ? style[Object.values(feedback)[0]] : ""
      }`}
    >
      {char || ""}
    </div>
  );
};

export default TableCell;
