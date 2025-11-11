// --- lib ---
import React from "react";

// --- components ---
import TableCell from "../TableCell/TableCell";

// --- style ---
import style from "./TableLine.module.scss";

const NUMBER_OF_COLS = 5;

type TableLineProps = {
  word: string;
  hasError?: boolean;
  feedback?: Record<string, "correct" | "present" | "absent">[] | undefined;
};

const TableLine = ({ word, hasError, feedback }: TableLineProps) => {
  return (
    <div className={`${style["table-line"]} ${hasError ? style["shake"] : ""}`}>
      {[...Array(NUMBER_OF_COLS)].map((cell, cellIndex) => (
        <TableCell
          key={cellIndex}
          char={word[cellIndex] || ""}
          feedback={feedback ? feedback[cellIndex] : undefined}
        />
      ))}
    </div>
  );
};

export default TableLine;
