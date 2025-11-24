import React, { useEffect, useRef } from "react";
import style from "./GameModal.module.scss";

interface GameModalProps {
  isVisible: boolean;
  message: string;
  type?: "success" | "error";
  autoHideMs?: number;
  onHide?: () => void;
}

const GameModal: React.FC<GameModalProps> = ({
  isVisible,
  message,
  type = "success",
  autoHideMs,
  onHide,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = modalRef.current;
    if (!el) return;

    if (isVisible) {
      el.classList.add(style.show);
      el.classList.remove(style.hide);

      if (autoHideMs) {
        const timeout = setTimeout(() => {
          el.classList.remove(style.show);
          el.classList.add(style.hide);
          onHide?.();
        }, autoHideMs);
        return () => clearTimeout(timeout);
      }
    } else {
      el.classList.remove(style.show);
      el.classList.add(style.hide);
    }
  }, [isVisible, autoHideMs, onHide]);

  return (
    <div ref={modalRef} className={style["message-modal"]}>
      <div
        className={
          type === "error" ? style["error-message"] : style["success-message"]
        }
      >
        {message}
      </div>
    </div>
  );
};

export default GameModal;
