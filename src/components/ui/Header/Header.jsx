import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Header.css";

// Массив пунктов меню
const NAV_ITEMS = [
  { label: "ПРАЙС", href: "/prices", isRoute: true },
  { label: "ОТЗЫВЫ", href: "#testimonials" },
  { label: "СВЯЗАТЬСЯ С НАМИ", href: "#contact" },
];

// Услуги для выпадающего меню - новая структура услуг (точно как у конкурентов)
const SERVICES_MENU = [
  {
    id: "handyman",
    title: "Услуга муж на час",
    type: "category", // обычная категория
  },
  {
    id: "water_tanks",
    title: "Установка накопительных баков автономного водоснабжения",
    type: "direct", // прямая ссылка на услугу
    serviceId: "water-tank-installation",
  },
  {
    id: "turnkey_repair",
    title: "Ремонт с 0 под ключ",
    type: "direct",
    serviceId: "remont-s-nulya-pod-klyuch",
  },
  {
    id: "plumbing",
    title: "Сантехнические работы",
    type: "category",
  },
  {
    id: "electrical",
    title: "Электромонтажные работы",
    type: "category",
  },
  {
    id: "furniture",
    title: "Сборка разборка мебели",
    type: "category",
  },
  {
    id: "windows",
    title: "Ремонт пластиковых окон",
    type: "category",
  },
  {
    id: "minor_repair",
    title: "Мелкий ремонт в квартире",
    type: "category",
  },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isPhoneOpen, setIsPhoneOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Эффект для скролла
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []); // пустой массив

  // Эффект для закрытия меню при смене страницы
  useEffect(() => {
    setIsServicesOpen(false);
    setIsMenuOpen(false);
  }, [location.pathname]); // ← важно! зависимость от пути

  // Функция для навигации к секции
  const handleNavClick = (item) => {
    setIsMenuOpen(false);

    if (item.isRoute) {
      navigate(item.href);
      return;
    }

    if (location.pathname === "/") {
      const element = document.querySelector(item.href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      navigate("/");
      setTimeout(() => {
        const element = document.querySelector(item.href);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
  };

  return (
    <header className={`fixed-header ${isScrolled ? "scrolled" : ""}`}>
      <div className="header-container">
        <div className="logo">
          <Link to="/">
            <img src="/assets/header/plumber.png" alt="plumber Logo" />
            <span className="logo-text">
              СТРОЙ
              <br />
              <span className="logo-text-small">НЕ САМ</span>
            </span>
          </Link>
        </div>

        <div
          className={`header-phone ${isPhoneOpen ? "active" : ""}`}
          onClick={() => setIsPhoneOpen(!isPhoneOpen)}
        >
          <div className="phone-wrapper">
            <a href="tel:+79490517136" className="phone-link">
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
                <span className="phone-number">+7 (949) 051-71-36</span>
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
          {/* Выпадающее меню услуг */}
          <div
            className="services-dropdown"
            onMouseEnter={() => setIsServicesOpen(true)}
            onMouseLeave={() => setIsServicesOpen(false)}
          >
            <Link to="/products" className="nav-btn services-btn">
              УСЛУГИ
              <svg
                className="dropdown-arrow"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </Link>

            {isServicesOpen && (
              <div className="services-menu">
                <div className="services-list">
                  {SERVICES_MENU.map((service) => (
                    <Link
                      key={service.id}
                      to={
                        service.type === "direct"
                          ? `/services/${service.id}/${service.serviceId}`
                          : `/services/${service.id}`
                      }
                      className="service-item"
                      onClick={() => setIsServicesOpen(false)}
                    >
                      {service.title}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {NAV_ITEMS.map((item, index) => (
            <button
              key={index}
              onClick={() => handleNavClick(item)}
              className={`nav-btn ${
                item.label === "СВЯЗАТЬСЯ С НАМИ" ? "contact-btn" : ""
              }`}
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
