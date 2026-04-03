import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./CookieBanner.css";

const CookieBanner = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem("cookieAccepted");
    if (!accepted) setVisible(true);
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookieAccepted", "true");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className="cookie-banner"
      role="dialog"
      aria-label="Уведомление об использовании cookie"
    >
      <p className="cookie-text">
        Этот сайт использует cookie для хранения данных. Продолжая использовать
        сайт, Вы даёте согласие на работу с{" "}
        <Link to="/privacy" className="cookie-link">
          этими файлами
        </Link>
        .
      </p>
      <button className="cookie-btn" onClick={handleAccept}>
        Принимаю
      </button>
    </div>
  );
};

export default CookieBanner;
