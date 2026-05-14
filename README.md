# � Сайт доставких технической воды — Строй Не Сам

> Сайт компании по доставке технической воды по Донецку, Макеевке и ДНР. React + Vite + Firebase + Telegram.

[![React](https://img.shields.io/badge/React-19.1.1-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.x-646CFF.svg)](https://vitejs.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-12.8.0-orange.svg)](https://firebase.google.com/)
[![License](https://img.shields.io/badge/License-Private-red.svg)]()

## 📋 О проекте

Сайт компании **Строй Не Сам** — доставка технической воды цистернами по Донецку, Макеевке и другим городам ДНР. Вода бесплатна, клиент платит только за доставку.

Контактный телефон: **+7 (949) 463-38-19**

### Основные возможности

- 🏠 Главная страница с презентацией услуг и формой заявки
- � Страница доставкри воды с тарифами, преимуществами и формой заказа
- � Формы обратной связи с валидацией
- 📱 Telegram-интеграция для мгновенных уведомлений о заявках
- � Firebase Firestore для хранения заявок
- 🎨 Современный дизайн с анимациями
- 📱 Адаптивная вёрстка для всех устройств

## 🛠 Технологический стек

- **React 19** — UI
- **React Router 7** — маршрутизация
- **Vite 7** — сборщик и dev-сервер
- **Firebase Firestore** — база данных заявок
- **Telegram Bot API** — уведомления
- **Tailwind CSS** — утилитарные стили
- **Zustand** — управление состоянием
- **Swiper** — слайдеры
- **Beget** — хостинг

## 📁 Структура проекта

```
├── src/
│   ├── components/
│   │   ├── forms/          # Формы (ContactForm, HeroForm)
│   │   ├── layouts/        # Layouts
│   │   ├── routes/         # Роутинг
│   │   └── ui/             # UI-компоненты (Header, Footer, Modal и др.)
│   ├── config/             # Конфигурация Firebase
│   ├── data/               # Статические данные
│   ├── hooks/              # Custom hooks
│   ├── pages/              # Страницы (WaterDelivery, Privacy и др.)
│   ├── services/           # API-сервисы
│   ├── utils/              # Утилиты
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── public/                 # Статические файлы и медиа
├── functions/              # Firebase Cloud Functions
├── .env                    # Переменные окружения (dev)
├── .env.production         # Переменные окружения (prod)
├── .htaccess.example       # Конфигурация Apache
├── deploy.sh               # Скрипт деплоя
├── vite.config.js
└── package.json
```

## 🚀 Быстрый старт

### Требования

- Node.js >= 18.0.0
- npm >= 9.0.0

### Установка

```bash
# 1. Установить зависимости
npm install

# 2. Настроить переменные окружения
cp .env.example .env
```

Заполните `.env`:

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...

VITE_TELEGRAM_BOT_TOKEN=...
VITE_TELEGRAM_CHAT_ID=...
```

```bash
# 3. Запустить dev-сервер
npm run dev
```

Откройте http://localhost:5173

## 📦 Сборка и деплой

```bash
# Сборка
npm run build

# Preview
npm run preview

# Деплой (скрипт)
./deploy.sh
```

Собранные файлы — в папке `dist/`. Загрузите содержимое в `public_html/` на Beget, создайте `.htaccess` из `.htaccess.example`.

## 📱 Страницы

| Путь              | Описание                               |
| ----------------- | -------------------------------------- |
| `/`               | Главная — услуги, преимущества, отзывы |
| `/water-delivery` | Доставка технической воды              |
| `/privacy`        | Политика конфиденциальности            |
| `/agreement`      | Пользовательское соглашение            |
| `/consent`        | Согласие на обработку данных           |

## � Безопасность

- `.env` не попадает в Git
- Firebase Security Rules — только создание заявок
- Валидация форм на клиенте
- Безопасные заголовки в `.htaccess`

## 🐛 Частые проблемы

**404 при переходе по ссылкам** — проверьте `.htaccess` и mod_rewrite на сервере.

**Формы не отправляются** — проверьте `.env.production` и пересоберите проект.

**Firebase/Telegram не работают локально** — это нормально из-за proxy. На продакшене работает штатно.

## 📞 Контакты

- **Телефон:** +7 (949) 463-38-19
- **МАХ:** https://max.ru/join/uIgOJQGyVxaGeEX2iBeObfdLKs23VCIzwrqiE1D37YA

---

**Версия:** 1.1.0 · **Обновлено:** май 2026 · **Статус:** Production ✅
