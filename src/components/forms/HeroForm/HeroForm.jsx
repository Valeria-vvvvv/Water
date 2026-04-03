import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./HeroForm.css";
import { submitContactForm } from "../../../services/contactService";
import { Modal } from "../../ui/Modal/Modal";

const HeroForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    consent: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.consent) {
      alert("Необходимо согласие на обработку данных");
      return;
    }

    setIsSubmitting(true);

    try {
      // Подготавливаем данные для Firebase
      const contactData = {
        name: formData.name,
        phone: formData.phone,
        surname: "", // пустое поле для совместимости
        email: "", // пустое поле для совместимости
        comment: "Заявка с главной страницы",
        source: "hero_form",
      };

      // Отправляем данные в Firebase
      const result = await submitContactForm(contactData);

      if (result.success) {
        // Очистка формы после успешной отправки
        setFormData({
          name: "",
          phone: "",
          consent: false,
        });

        // Показываем красивое модальное окно
        setIsModalOpen(true);
      } else {
        throw new Error(result.error || "Ошибка при сохранении заявки");
      }
    } catch (error) {
      alert("Произошла ошибка. Попробуйте еще раз.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <form className="hero-form" onSubmit={handleSubmit}>
        <h3 className="hero-form__title">Оставьте заявку</h3>

        <input
          className="hero-form__field"
          type="text"
          name="name"
          placeholder="Ваше имя"
          value={formData.name}
          onChange={handleInputChange}
          required
        />

        <input
          className="hero-form__field"
          type="tel"
          name="phone"
          placeholder="Ваш номер телефона*"
          value={formData.phone}
          onChange={handleInputChange}
          required
          minLength={6}
        />

        <label className="hero-form__consent">
          <input
            type="checkbox"
            name="consent"
            checked={formData.consent}
            onChange={handleInputChange}
            required
          />
          <span>
            Принимаю условия{" "}
            <Link to="/agreement" target="_blank" rel="noopener noreferrer">
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
          className="hero-form__submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Отправляем..." : "Отправить"}
        </button>
      </form>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Заявка отправлена!"
        message="Спасибо за обращение! Мы получили вашу заявку и свяжемся с вами в ближайшее время."
      />
    </>
  );
};

export default HeroForm;
