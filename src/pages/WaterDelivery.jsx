import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./WaterDelivery.css";
import { submitContactForm } from "../services/contactService";
import { Modal } from "../components/ui/Modal/Modal";
import water2Img from "../water/water2.PNG";
import waterImg from "../water/water-img.png";

const PRICES = [
  { volume: "До 500 литров", price: "1 500 руб." },
  { volume: "До 1 000 литров", price: "2 000 руб.", popular: true },
  { volume: "2 тонны", price: "4 000 руб." },
  { volume: "3 тонны", price: "6 000 руб." },
  { volume: "4 тонны", price: "7 500 руб." },
];

const ADVANTAGES = [
  {
    icon: "💨",
    title: "Работаем оперативно",
    desc: "Быстрый выезд и чёткое выполнение заказа — без лишних ожиданий.",
  },
  {
    icon: "💪",
    title: "Всё делаем сами",
    desc: "Водитель справляется самостоятельно — ваша помощь не потребуется.",
  },
  {
    icon: "😎",
    title: "Полная автономность",
    desc: "Не нужен ваш свет и розетки — мы полностью автономны. Даже при отключении электричества по городу без воды вас не оставим!",
  },
  {
    icon: "💦",
    title: "Чистейшая вода",
    desc: "Вода проходит дополнительную фильтрацию прямо в автомобиле перед подачей. Техническая вода — для бытовых нужд; питьевая — только прошедшая соответствующую обработку. ☝️",
  },
  {
    icon: "🫰",
    title: "Шланг 50 метров · до 9 этажа",
    desc: "🏢 Доставляем до 14 этажа включительно — длина шланга 75 м. ⬆️ После 9 этажа — длина шланга 50м: доплата 500 рублей",
  },
  {
    icon: "🤝",
    title: "Делим воду с соседом",
    desc: "Можно разделить заказ с соседом из одного подъезда. Также принимаем тару по 5 л — до 20 единиц на один адрес. Можно разделить заказ на несколько квартир.",
  },
  {
    icon: "🏗️",
    title: "Устанавливаем накопительные баки",
    desc: "Монтируем накопительные баки с насосной станцией. Не переплачивайте 60–100 тыс. — уточните цену у нас! ☺️",
  },
];

const WaterDelivery = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    volume: "",
    consent: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.consent) {
      // Используем безопасный alert
      try {
        alert("Необходимо согласие на обработку данных");
      } catch {
        // Тихая обработка ошибки alert
      }
      return;
    }
    setIsSubmitting(true);
    try {
      const result = await submitContactForm({
        name: formData.name,
        phone: formData.phone,
        comment: `Доставка технической воды. Объём: ${formData.volume || "не указан"}`,
        source: "water_delivery_form",
      });
      if (result.success) {
        setFormData({ name: "", phone: "", volume: "", consent: false });
        setIsModalOpen(true);
      } else {
        // Показываем ошибку безопасно
        try {
          alert(result.error || "Произошла ошибка. Попробуйте ещё раз.");
        } catch {
          // Тихая обработка ошибки alert
        }
      }
    } catch {
      // Безопасная обработка ошибки
      try {
        alert("Произошла ошибка. Попробуйте ещё раз.");
      } catch {
        // Тихая обработка ошибки alert
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="wd-page">
      {/* HERO */}
      <section className="wd-hero">
        <video
          className="wd-hero__video"
          src="/assets/header/plumber.mp4"
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="wd-hero__overlay" />
        <div className="wd-hero__container">
          <div className="wd-hero__text">
            <span className="wd-hero__badge">Донецк</span>
            <h1 className="wd-hero__title">Доставка технической воды</h1>
            <p className="wd-hero__subtitle">
              Привозим техническую воду по Донецку, ДНР. Вода{" "}
              <strong>бесплатна</strong> — платите только за доставку.
            </p>
            <a href="tel:+79490517136" className="wd-hero__call-btn">
              Позвонить: +7 (949) 051-71-36
            </a>
          </div>

          <div className="wd-hero__image-wrap">
            <div className="wd-hero__image-glow" />
            <img
              src={water2Img}
              alt="Доставка воды"
              className="wd-hero__image"
            />
          </div>

          <div className="wd-hero__form-wrap">
            <form className="wd-form" onSubmit={handleSubmit}>
              <h3 className="wd-form__title">Заказать доставку</h3>
              <input
                className="wd-form__input"
                type="text"
                name="name"
                placeholder="Ваше имя"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <input
                className="wd-form__input"
                type="tel"
                name="phone"
                placeholder="Номер телефона *"
                value={formData.phone}
                onChange={handleChange}
                required
                minLength={6}
              />
              <select
                className="wd-form__input wd-form__select"
                name="volume"
                value={formData.volume}
                onChange={handleChange}
              >
                <option value="">Объём воды (необязательно)</option>
                {PRICES.map((p) => (
                  <option key={p.volume} value={p.volume}>
                    {p.volume} — {p.price}
                  </option>
                ))}
                <option value="более 4 тонн">
                  Более 4 тонн — по договорённости
                </option>
              </select>
              <label className="wd-form__consent">
                <input
                  type="checkbox"
                  name="consent"
                  checked={formData.consent}
                  onChange={handleChange}
                  required
                />
                <span>
                  Принимаю условия{" "}
                  <Link
                    to="/agreement"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Соглашения
                  </Link>
                  ,{" "}
                  <Link to="/privacy" target="_blank" rel="noopener noreferrer">
                    Политики
                  </Link>{" "}
                  и{" "}
                  <Link to="/consent" target="_blank" rel="noopener noreferrer">
                    Согласия
                  </Link>
                </span>
              </label>
              <button
                type="submit"
                className="wd-form__submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Отправляем..." : "Оставить заявку"}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* PRICES */}
      <section className="wd-prices" id="wd-prices">
        <div className="wd-container">
          <h2 className="wd-section-title">
            СТОИМОСТЬ <span className="wd-accent">ДОСТАВКИ</span>
          </h2>
          <div className="wd-prices__grid">
            {PRICES.map((item) => (
              <div
                key={item.volume}
                className={`wd-price-card ${item.popular ? "wd-price-card--popular" : ""}`}
              >
                {item.popular && (
                  <div className="wd-price-card__badge">Популярно</div>
                )}
                <div className="wd-price-card__volume">{item.volume}</div>
                <div className="wd-price-card__price">{item.price}</div>
              </div>
            ))}
          </div>
          <div className="wd-prices__note">
            <p>🏢 Доставляем до 14 этажа включительно — длина шланга 75 м</p>
            <p>
              ⬆️ После 9 этажа — доплата <strong>500 рублей</strong>
            </p>
          </div>
        </div>
      </section>

      {/* ADVANTAGES */}
      <section className="wd-advantages" id="wd-advantages">
        <div className="wd-container">
          <h2 className="wd-section-title">
            НАШИ <span className="wd-accent">ПРЕИМУЩЕСТВА</span>
          </h2>
          <div className="wd-advantages__grid">
            {ADVANTAGES.map((adv, i) => (
              <div key={i} className="wd-advantage-card">
                <div className="wd-advantage-card__icon">{adv.icon}</div>
                <h3 className="wd-advantage-card__title">{adv.title}</h3>
                <p className="wd-advantage-card__desc">{adv.desc}</p>
              </div>
            ))}
          </div>
          <div className="wd-advantages__cta-banner">
            <p className="wd-advantages__cta-text">
              По любому вопросу, для заказа воды или установки накопительных
              систем — пишите нам:
            </p>
            <a
              href="https://max.ru/join/uIgOJQGyVxaGeEX2iBeObfdLKs23VCIzwrqiE1D37YA"
              target="_blank"
              rel="noopener noreferrer"
              className="wd-cta__btn wd-cta__btn--primary wd-advantages__cta-btn"
            >
              Написать в МАХ 💬
            </a>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="wd-about">
        <div className="wd-container">
          <h2 className="wd-section-title">
            О <span className="wd-accent">ДОСТАВКЕ ВОДЫ</span>
          </h2>
          <div className="wd-about__inner">
            <div className="wd-about__content">
              <p>
                В современном мире доступ к чистой и надёжной воде является
                первостепенной потребностью для комфортной жизни каждого
                человека. Наши территории испытывают определённые трудности с
                обеспечением населения достаточным количеством воды. В таких
                случаях услуга доставки технической воды становится незаменимой.
              </p>
              <p>
                Наша компания предлагает жителям <strong>Донецка</strong>{" "}
                профессиональные услуги по доставке технической воды, которая
                призвана удовлетворить потребности населения в чистой и
                безопасной воде для различных бытовых и промышленных нужд.
              </p>
              <h3>
                Заказывая услугу доставки технической воды в нашей компании, вы
                получаете:
              </h3>
              <ol>
                <li>
                  <strong>Надёжность и своевременность</strong> — гарантируем
                  выполнение заказов в срок.
                </li>
                <li>
                  <strong>Гибкую систему заказов</strong> — выбирайте удобное
                  время и место доставки.
                </li>
                <li>
                  <strong>Конкурентоспособные цены</strong> — доступные тарифы
                  для широкого круга потребителей.
                </li>
                <li>
                  <strong>Индивидуальный подход</strong> — дорожим каждым
                  клиентом и стремимся удовлетворить все потребности.
                </li>
              </ol>
              <div className="wd-about__highlight">
                <strong>Обращаем ваше внимание:</strong> вода абсолютно{" "}
                <span className="wd-accent">БЕСПЛАТНА</span>! Вы платите только
                за доставку.
              </div>
            </div>
            <div className="wd-about__image">
              <img src={waterImg} alt="Доставка технической воды" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="wd-cta" id="wd-contact">
        <div className="wd-container">
          <h2 className="wd-cta__title">Нужна техническая вода?</h2>
          <p className="wd-cta__text">
            Звоните прямо сейчас или оставьте заявку — мы перезвоним в течение
            15 минут
          </p>
          <div className="wd-cta__buttons">
            <a
              href="tel:+79494633819"
              className="wd-cta__btn wd-cta__btn--primary"
            >
              Позвонить: +7 (949) 463-38-19
            </a>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="wd-cta__btn wd-cta__btn--secondary"
            >
              Оставить заявку
            </a>
          </div>
        </div>
      </section>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Заявка отправлена!"
        message="Спасибо за обращение! Мы получили вашу заявку и свяжемся с вами в ближайшее время."
      />
    </div>
  );
};

export default WaterDelivery;
