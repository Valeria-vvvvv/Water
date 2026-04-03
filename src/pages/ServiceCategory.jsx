import React, { useEffect } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { useServicesByCategory, useServices } from "../hooks/useServices";
import { useThematicImageUrl } from "../hooks/useThematicImageUrl";
import Footer from "../components/ui/Footer/Footer";
import "./ServiceCategory.css";

const ServiceCard = ({ categoryId, service }) => {
  const { url, loading } = useThematicImageUrl(categoryId, service);
  return (
    <Link to={`/services/${categoryId}/${service.id}`} className="service-card">
      <div className="service-image">
        {!loading && url ? (
          <img src={url} alt={service.title} />
        ) : (
          <div className="service-image-placeholder" aria-hidden />
        )}
        <div className="service-overlay"></div>
      </div>
      <div className="service-content">
        <h3 className="service-title">{service.title}</h3>
        <p className="service-description">{service.shortDescription}</p>
        <div className="service-price">{service.priceFrom}</div>
        <div className="service-button">Подробнее</div>
      </div>
    </Link>
  );
};

export const ServiceCategory = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { categories } = useServices();
  const { services, loading, error } = useServicesByCategory(categoryId);

  const category = categories[categoryId];

  // Скролл наверх при монтировании компонента
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [categoryId]);

  const handleOperatorClick = (e) => {
    e.preventDefault();
    if (location.pathname === "/") {
      // Если на главной странице - просто скроллим
      const element = document.querySelector("#contact");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      // Если на другой странице - переходим на главную и скроллим
      navigate("/");
      setTimeout(() => {
        const element = document.querySelector("#contact");
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
  };

  if (loading) {
    return (
      <div className="service-category-page">
        <div className="service-container">
          <div
            style={{ textAlign: "center", padding: "100px 0", color: "white" }}
          >
            Загрузка услуг...
          </div>
        </div>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="service-category-page">
        <div className="service-container">
          <div className="not-found">
            <h2>Категория не найдена</h2>
            <Link to="/products" className="back-btn">
              Вернуться к услугам
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="service-category-page">
      <div className="service-container">
        {/* Хлебные крошки */}
        <div className="breadcrumbs">
          <Link to="/" className="breadcrumb-link">
            Главная
          </Link>
          <span className="breadcrumb-separator">›</span>
          <Link to="/products" className="breadcrumb-link">
            Все услуги
          </Link>
          <span className="breadcrumb-separator">›</span>
          <span className="breadcrumb-current">{category.title}</span>
        </div>

        {/* Заголовок категории */}
        <h1 className="products-title">
          {category.title.split(" ")[0]}
          <span className="products-subtitle">
            {" "}
            {category.title.split(" ").slice(1).join(" ")}
          </span>
        </h1>

        {/* Плашка с оператором */}
        <div className="operator-banner">
          <div className="operator-banner-content">
            <div className="operator-icon">
              <div className="operator-avatar">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span className="online-indicator"></span>
              </div>
            </div>
            <div className="operator-text">
              <p className="operator-message">
                Не нашли нужную услугу в списке? Свяжитесь с нашим оператором
                для подробной консультации
              </p>
            </div>
            <a
              href="#contact"
              className="operator-button"
              onClick={handleOperatorClick}
            >
              <svg
                className="chat-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              Связаться с оператором
            </a>
          </div>
        </div>

        {/* Сетка услуг */}
        <div className="services-grid">
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              categoryId={categoryId}
              service={service}
            />
          ))}
        </div>

        {/* Общая информация о категории */}
        <div className="category-info-section">
          <h2>Почему выбирают наши услуги?</h2>
          <div className="info-cards">
            <div className="info-card">
              <div className="info-icon">🛡️</div>
              <h4>Гарантия качества</h4>
              <p>Предоставляем гарантию на все виды работ до 2 лет</p>
            </div>

            <div className="info-card">
              <div className="info-icon">🚗</div>
              <h4>Фиксированная стоимость выезда</h4>
              <p>Выезд мастера и диагностика — по единой фиксированной цене</p>
            </div>

            <div className="info-card">
              <div className="info-icon">💰</div>
              <h4>Фиксированные цены</h4>
              <p>Стоимость не изменится после начала работ</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};
