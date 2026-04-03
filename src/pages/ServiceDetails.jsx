import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useService } from "../hooks/useServices";
import { useThematicImageUrl } from "../hooks/useThematicImageUrl";
import Footer from "../components/ui/Footer/Footer";
import ContactForm from "../components/forms/ContactForm/ContactForm";
import "./ServiceDetails.css";

// Компонент аккордеона для таблицы
const PricingAccordion = ({ service }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="pricing-accordion">
      <div className="accordion-header" onClick={() => setIsOpen(!isOpen)}>
        <h3>Расценки на {service.title.toLowerCase()}</h3>
        <div className={`accordion-arrow ${isOpen ? "open" : ""}`}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M6 9l6 6 6-6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {isOpen && (
        <div className="accordion-content">
          <table className="pricing-table">
            <thead>
              <tr>
                <th>НАИМЕНОВАНИЕ РАБОТ</th>
                <th>ЕД. ИЗМ.</th>
                <th>СТОИМОСТЬ, РУБ. (ОТ)</th>
              </tr>
            </thead>
            <tbody>
              {service.priceTable.map((item, index) => (
                <tr key={index}>
                  <td>{item.name}</td>
                  <td>{item.unit}</td>
                  <td>{item.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export const ServiceDetails = () => {
  const { categoryId, serviceId } = useParams();
  const { service, category, loading, error } = useService(
    categoryId,
    serviceId,
  );
  const { url: imageUrl, loading: imageLoading } = useThematicImageUrl(
    categoryId,
    service,
  );

  // Скролл наверх при монтировании компонента
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [categoryId, serviceId]);

  if (loading) {
    return (
      <div className="service-details-page">
        <div className="service-container">
          <div
            style={{ textAlign: "center", padding: "100px 0", color: "white" }}
          >
            Загрузка услуги...
          </div>
        </div>
      </div>
    );
  }

  if (error || !service || !category) {
    return (
      <div className="service-details-page">
        <div className="service-container">
          <div className="not-found">
            <h2>Услуга не найдена</h2>
            <Link to="/products" className="back-btn">
              Вернуться к услугам
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="service-details-page">
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
          <Link to={`/services/${categoryId}`} className="breadcrumb-link">
            {category.title}
          </Link>
          <span className="breadcrumb-separator">›</span>
          <span className="breadcrumb-current">{service.title}</span>
        </div>

        {/* Заголовок страницы */}
        <div className="service-header">
          <h1 className="service-title">{service.title}</h1>
        </div>

        {/* Блок с фото и кратким описанием */}
        <div className="service-intro">
          <div className="service-intro-image">
            {!imageLoading && imageUrl ? (
              <img
                src={imageUrl}
                alt={service.title}
                className="service-image"
              />
            ) : (
              <div className="service-intro-image-placeholder" aria-hidden />
            )}
          </div>
          <div className="service-intro-content">
            <h2 className="service-intro-title">{service.title}</h2>
            <div className="service-intro-description">
              <p>{service.description}</p>
            </div>
            <div className="service-price-info">
              <span className="price-value">{service.priceFrom}</span>
            </div>
          </div>
        </div>

        {/* Детальное описание в отдельных блоках */}
        {service.fullDescription && (
          <div
            className="service-detailed-content"
            dangerouslySetInnerHTML={{ __html: service.fullDescription }}
          />
        )}

        {/* Основное описание */}
        <div className="service-content">
          <div className="service-features">
            <div className="service-features-container">
              <div className="service-features-left">
                <h3>Что входит в услугу:</h3>
                <p>
                  У нас доступные цены на {service.title.toLowerCase()}.
                  Обслуживаем квартиры, частные дома, офисы и производственные
                  предприятия. Мастера работают по официальному договору и дают
                  гарантию на все услуги. Используем только качественные
                  материалы и современное оборудование.
                </p>
              </div>
              <div className="service-features-right">
                <div className="features-grid">
                  {service.features.map((feature, index) => (
                    <div key={index} className="feature-card">
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Таблица цен */}
          <div>
            <h2 className="pricing-title">
              Расценки на {service.title.toLowerCase()} 2026
            </h2>

            <PricingAccordion service={service} />
          </div>

          {/* Дополнительная информация */}
          <div className="additional-info">
            <div className="info-cards">
              <div className="info-card">
                <div className="info-icon">🛡️</div>
                <h4>Гарантия качества</h4>
                <p>Предоставляем гарантию на все виды работ до 2 лет</p>
              </div>

              <div className="info-card">
                <div className="info-icon">🚗</div>
                <h4>Фиксированная стоимость выезда</h4>
                <p>
                  Выезд мастера и диагностика — по единой фиксированной цене
                </p>
              </div>

              <div className="info-card">
                <div className="info-icon">💰</div>
                <h4>Фиксированные цены</h4>
                <p>Стоимость не изменится после начала работ</p>
              </div>
            </div>

            <div className="contact-form-container">
              <div className="contact-form-left">
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};
