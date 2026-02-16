# Миграция на новую систему изображений

## Что изменилось

### ❌ Старый подход (не работал)

- Unsplash API → CORS ошибки
- Yandex Search API → сложная настройка, не работало
- source.unsplash.com → сервис закрыт

### ✅ Новый подход (работает)

- **Pexels API** - бесплатный, без CORS
- **Firebase Storage** - кеширование изображений
- **Автоматическая загрузка** - через Cloud Functions или браузер

## Удаленные файлы

Можно безопасно удалить (больше не используются):

```bash
rm src/services/unsplashService.js
rm src/services/yandexImageService.js
```

## Новые файлы

### Сервисы

- `src/services/pexelsService.js` - работа с Pexels API
- `src/services/imageStorageService.js` - работа с Firebase Storage

### Утилиты

- `src/utils/imageLoader.js` - массовая загрузка изображений

### Cloud Functions (опционально)

- `functions/index.js` - автоматическая загрузка
- `functions/package.json` - зависимости функций

### Документация

- `docs/QUICK_START_IMAGES.md` - быстрый старт
- `docs/PEXELS_FIREBASE_SETUP.md` - полная настройка
- `docs/MIGRATION_GUIDE.md` - этот файл

## Обновленные файлы

### `src/config/firebase.js`

Добавлен импорт Storage:

```javascript
import { getStorage } from "firebase/storage";
export const storage = getStorage(app);
```

### `src/hooks/useThematicImageUrl.js`

Теперь использует Firebase Storage вместо прямых API запросов:

```javascript
import { getOrCreateServiceImage } from "../services/imageStorageService";
```

### `.env.example`

Заменен Unsplash/Yandex на Pexels:

```env
VITE_PEXELS_API_KEY=your-pexels-api-key
```

### `src/main.jsx`

Добавлен импорт утилиты для консоли:

```javascript
import "./utils/imageLoader.js";
```

## Миграция: пошаговая инструкция

### 1. Получить Pexels API ключ

https://www.pexels.com/api/ → Get Started

### 2. Обновить .env

```env
VITE_PEXELS_API_KEY=ваш-ключ
```

### 3. Настроить Firebase Storage

Firebase Console → Storage → Get Started

### 4. Удалить старые сервисы (опционально)

```bash
rm src/services/unsplashService.js
rm src/services/yandexImageService.js
```

### 5. Перезапустить проект

```bash
npm run dev
```

### 6. Загрузить изображения

Открыть консоль браузера (F12):

```javascript
await window.imageLoader.loadAllImages();
```

## Преимущества нового подхода

| Критерий          | Старый подход      | Новый подход    |
| ----------------- | ------------------ | --------------- |
| CORS ошибки       | ❌ Да              | ✅ Нет          |
| Скорость загрузки | 🐌 Медленно        | ⚡ Быстро (кеш) |
| Надежность        | ❌ Не работает     | ✅ Работает     |
| Настройка         | 😰 Сложная         | 😊 Простая      |
| Стоимость         | 💰 Платно (Yandex) | 🆓 Бесплатно    |
| Лимиты            | ⚠️ Строгие         | ✅ Щедрые       |

## Структура изображений в Storage

```
your-project.appspot.com/
└── images/
    ├── plumbing/
    │   ├── sink-installation-1234567890.jpg
    │   ├── toilet-installation-1234567891.jpg
    │   └── ...
    ├── electrical/
    │   └── ...
    └── furniture/
        └── ...
```

## Как работает новая система

```
┌─────────────────┐
│  Пользователь   │
│  открывает      │
│  страницу       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ useThematicImage│  Проверяет Storage
│      Url        │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌───────┐  ┌──────────┐
│ Есть  │  │  Нет     │
│ в     │  │  в       │
│Storage│  │ Storage  │
└───┬───┘  └────┬─────┘
    │           │
    │           ▼
    │      ┌─────────┐
    │      │ Pexels  │
    │      │  API    │
    │      └────┬────┘
    │           │
    │           ▼
    │      ┌─────────┐
    │      │ Upload  │
    │      │   to    │
    │      │ Storage │
    │      └────┬────┘
    │           │
    └───────────┘
         │
         ▼
    ┌─────────┐
    │ Показать│
    │  фото   │
    └─────────┘
```

## FAQ

### Q: Нужно ли удалять старые сервисы?

A: Не обязательно, но рекомендуется для чистоты кода.

### Q: Что делать с существующими изображениями?

A: Они будут заменены новыми из Pexels при первой загрузке.

### Q: Можно ли использовать без Cloud Functions?

A: Да! Загрузка через консоль браузера работает отлично.

### Q: Сколько времени займет загрузка всех изображений?

A: ~10-15 минут для всех категорий (из-за лимитов API).

### Q: Что если Pexels API не работает?

A: Система автоматически использует локальные fallback изображения.

## Поддержка

При проблемах:

1. Проверить консоль браузера (F12)
2. Проверить Firebase Console → Storage
3. Проверить `.env` файл
4. Проверить `docs/QUICK_START_IMAGES.md`
