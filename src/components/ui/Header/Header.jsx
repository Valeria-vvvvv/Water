import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Header.css";

const NAV_ITEMS = [
  { label: "ЦЕНЫ", href: "#wd-prices" },
  { label: "ПРЕИМУЩЕСТВА", href: "#wd-advantages" },
  { label: "СВЯЗАТЬСЯ С НАМИ", href: "#wd-contact" },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isPhoneOpen, setIsPhoneOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const handleNavClick = (item) => {
    setIsMenuOpen(false);
    const scrollToSection = () => {
      const el = document.querySelector(item.href);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    };
    if (location.pathname === "/") {
      scrollToSection();
    } else {
      navigate("/");
      setTimeout(scrollToSection, 100);
    }
  };

  return (
    <header className={`fixed-header ${isScrolled ? "scrolled" : ""}`}>
      <div className="header-container">
        <div className="logo">
          <Link to="/">
            <img src="/src/water/plumber2.png" alt="Logo" />
            <span className="logo-text">
              ДОСТАВКА
              <br />
              <span className="logo-text-small">техническОЙ ВОДЫ</span>
            </span>
          </Link>
        </div>

        <div
          className={`header-phone ${isPhoneOpen ? "active" : ""}`}
          onClick={() => setIsPhoneOpen(!isPhoneOpen)}
        >
          <div className="phone-wrapper">
            <a href="tel:+7949-463-38-19" className="phone-link">
              <svg
                className="phone-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21L6.16 10.928c-.732.732-.732 1.919 0 2.651l4.261 4.261c.732.732 1.919.732 2.651 0l1.541-4.064a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.948V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              <div className="phone-info">
                <span className="phone-number">+7 (949) 463-38-19</span>
              </div>
            </a>
            <div className="phone-location">г. Донецк</div>
          </div>
        </div>

        <button
          className="hamburger"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav className={`nav-buttons ${isMenuOpen ? "open" : ""}`}>
          {NAV_ITEMS.map((item, index) => (
            <button
              key={index}
              onClick={() => handleNavClick(item)}
              className={`nav-btn ${item.label === "СВЯЗАТЬСЯ С НАМИ" ? "contact-btn" : ""}`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;
