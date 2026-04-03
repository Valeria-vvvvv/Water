import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./ContactForm.css";
import { Modal } from "../../ui/Modal/Modal";
import { submitContactForm } from "../../../services/contactService";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    surname: "",
    email: "",
    comment: "",
    consent: false,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Очистка ошибки при изменении поля
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Валидация формы
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Имя обязательно";
    }

    if (!formData.surname.trim()) {
      newErrors.surname = "Фамилия обязательна";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Телефон обязателен";
    } else if (!/^[+0-9\s()-]{6,}$/.test(formData.phone)) {
      newErrors.phone = "Некорректный формат телефона";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email обязателен";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Некорректный формат email";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!formData.consent) {
      alert("Необходимо согласие на обработку данных");
      return;
    }

    setIsSubmitting(true);

    try {
      // Отправляем данные в Firebase
      const result = await submitContactForm(formData);

      if (result.success) {
        setIsModalOpen(true);

        // Очистка формы после успешной отправки
        setFormData({
          name: "",
          phone: "",
          surname: "",
          email: "",
          comment: "",
          consent: false,
        });
      } else {
        throw new Error(result.error || "Ошибка при сохранении заявки");
      }
    } catch (error) {
      alert("Произошла ошибка при отправке. Попробуйте еще раз.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="contact-form-wrapper">
        {/* Анимированный текст */}
        <div className="animated-text">
          <div className="text-line">
            <span>SERVICES</span>
            <span>SERVICES</span>
            <span>SERVICES</span>
            <span>SERVICES</span>
          </div>
        </div>

        <div className="form-container">
          <div className="form-content">
            <h2 className="form-title">
              ФОРМА <span className="form-subtitle">ОБРАТНОЙ СВЯЗИ</span>
            </h2>
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <div className="error-message">{errors.name || ""}</div>
                  <input
                    type="text"
                    name="name"
                    placeholder="Имя"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`form-input ${errors.name ? "error" : ""}`}
                    required
                  />
                </div>
                <div className="form-group">
                  <div className="error-message">{errors.phone || ""}</div>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Номер Телефона"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`form-input ${errors.phone ? "error" : ""}`}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <div className="error-message">{errors.surname || ""}</div>
                  <input
                    type="text"
                    name="surname"
                    placeholder="Фамилия"
                    value={formData.surname}
                    onChange={handleInputChange}
                    className={`form-input ${errors.surname ? "error" : ""}`}
                    required
                  />
                </div>
                <div className="form-group">
                  <div className="error-message">{errors.email || ""}</div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`form-input ${errors.email ? "error" : ""}`}
                    required
                  />
                </div>
              </div>

              <div className="form-group full-width form-width">
                <textarea
                  name="comment"
                  placeholder="Комментарий"
                  value={formData.comment}
                  onChange={handleInputChange}
                  className={`form-input ${errors.comment ? "error" : ""}`}
                  rows="4"
                ></textarea>
              </div>

              <div className="form-submit">
                <label className="contact-form__consent">
                  <input
                    type="checkbox"
                    name="consent"
                    checked={formData.consent}
                    onChange={handleInputChange}
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
                    <Link
                      to="/privacy"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Политики
                    </Link>{" "}
                    и{" "}
                    <Link
                      to="/consent"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Согласия
                    </Link>
                  </span>
                </label>
                <button
                  type="submit"
                  className="submit-btn"
                  disabled={isSubmitting}
                >
                  <span>
                    {isSubmitting ? "ОТПРАВЛЯЕМ..." : "ОСТАВИТЬ ЗАЯВКУ"}
                  </span>
                  <svg
                    className="submit-icon"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Заявка отправлена!"
        message="Мы получили вашу заявку и свяжемся с вами в ближайшее время."
      />
    </>
  );
};

export default ContactForm;
