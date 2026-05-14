import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../config/firebase";

export const submitContactForm = async (formData) => {
  let firebaseSuccess = false;
  let telegramSuccess = false;
  let usedFallback = false;

  // 1. Пытаемся сохранить в Firebase (с коротким таймаутом!)
  try {
    const savePromise = addDoc(collection(db, "contacts"), {
      ...formData,
      createdAt: serverTimestamp(),
      status: "new",
    });

    // Таймаут 3 секунды - если Firebase не ответил, идем дальше
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Firebase timeout")), 3000),
    );

    await Promise.race([savePromise, timeoutPromise]);
    firebaseSuccess = true;
  } catch (firebaseErr) {
    usedFallback = true;
  }

  // 2. Отправляем в Telegram В ЛЮБОМ СЛУЧАЕ (и как уведомление, и как fallback)
  try {
    telegramSuccess = await sendTelegramNotification(formData, usedFallback);
  } catch (tgErr) {
    // Тихо игнорируем ошибку
  }

  // Результат для пользователя
  if (firebaseSuccess || telegramSuccess) {
    return {
      success: true,
      message: usedFallback
        ? "Заявка принята! Мы свяжемся с вами скоро."
        : "Заявка успешно отправлена!",
    };
  }

  return {
    success: false,
    error: "Сервисы временно недоступны. Позвоните нам по телефону.",
  };
};

// Уведомление в Telegram (добавляем флаг fallback)
const sendTelegramNotification = async (formData, isFallback = false) => {
  const botToken = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
  const chatId = import.meta.env.VITE_TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) throw new Error("Telegram не настроен");

  // Красивое форматирование с эмодзи и разделителями
  const fallbackWarning = isFallback
    ? "⚠️ <b>ВНИМАНИЕ:</b> Firebase недоступен!\n\n"
    : "";

  const message =
    `${fallbackWarning}` +
    `🔔 <b>НОВАЯ ЗАЯВКА С САЙТА</b>\n` +
    `━━━━━━━━━━━━━━━━━━━━\n\n` +
    `👤 <b>Имя:</b> ${formData.name}${formData.surname ? " " + formData.surname : ""}\n` +
    `📱 <b>Телефон:</b> <code>${formData.phone}</code>\n` +
    (formData.email ? `📧 <b>Email:</b> ${formData.email}\n` : "") +
    (formData.comment
      ? `💬 <b>Комментарий:</b>\n<i>${formData.comment}</i>\n`
      : "") +
    `\n━━━━━━━━━━━━━━━━━━━━\n` +
    `📍 <b>Источник:</b> ${formData.source || "Форма обратной связи"}\n` +
    `⏰ <b>Дата:</b> ${new Date().toLocaleString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })}`;

  const res = await fetch(
    `https://api.telegram.org/bot${botToken}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "HTML", // Включаем HTML форматирование
      }),
    },
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(err);
  }

  return true;
};
