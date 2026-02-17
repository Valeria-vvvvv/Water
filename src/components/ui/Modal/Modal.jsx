import { useEffect } from "react";
import { createPortal } from "react-dom";
import "./Modal.css";

export const Modal = ({ isOpen, onClose, title, message }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";

      const handleEscape = (e) => {
        if (e.key === "Escape") onClose();
      };

      document.addEventListener("keydown", handleEscape);

      return () => {
        document.body.style.overflow = "unset";
        document.removeEventListener("keydown", handleEscape);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          ×
        </button>

        <div className="modal-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        <h2 className="modal-title">{title}</h2>
        <p className="modal-message">{message}</p>

        <button className="modal-button" onClick={onClose}>
          Отлично!
        </button>
      </div>
    </div>,
    document.body,
  );
};
