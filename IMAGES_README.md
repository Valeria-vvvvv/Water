# 📸 Система тематических изображений

## 🎯 Что реализовано

Автоматическая загрузка тематических изображений для карточек товаров/услуг с использованием:

- ✅ **Pexels API** - бесплатный поиск фото (без CORS проблем)
- ✅ **Firebase Storage** - хранение и кеширование изображений
- ✅ **Автоматическая загрузка** - при первом просмотре или массово
- ✅ **Cloud Functions** (опционально) - автообновление раз в неделю

## 🚀 Быстрый старт (5 минут)

### 1. Получить Pexels API ключ

```
https://www.pexels.com/api/ → Get Started → Скопировать API Key
```

### 2. Добавить в .env

```env
VITE_PEXELS_API_KEY=ваш-ключ-здесь
```

### 3. Настроить Firebase Storage

1. Firebase Console → Storage → Get Started
2. Выбрать регион (europe-west1)
3. В Rules добавить:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /images/{categoryId}/{imageId} {
      allow read: if true;
    }
  }
}
```

### 4. Запустить и загрузить

```bash
npm run dev
```

Открыть консоль браузера (F12):

```javascript
// Проверить статус
await window.imageLoader.checkImagesStatus();

// Загрузить для категории
await window.imageLoader.loadCategoryImages("plumbing");

// Загрузить все (~10-15 минут)
await window.imageLoader.loadAllImages();
```

## 📚 Документация

- **[QUICK_START_IMAGES.md](docs/QUICK_START_IMAGES.md)** - быстрый старт
- **[PEXELS_FIREBASE_SETUP.md](docs/PEXELS_FIREBASE_SETUP.md)** - полная настройка с Cloud Functions
- **[MIGRATION_GUIDE.md](docs/MIGRATION_GUIDE.md)** - что изменилось

## 🏗️ Архитектура

```
Пользователь открывает страницу
         ↓
useThematicImageUrl проверяет Storage
         ↓
    ┌────┴────┐
    ↓         ↓
  Есть      Нет
    ↓         ↓
Показать  Pexels API → Upload → Показать
```

## 📁 Структура файлов

### Новые файлы

```
src/
├── services/
│   ├── pexelsService.js          # Работа с Pexels API
│   └── imageStorageService.js    # Работа с Firebase Storage
├── utils/
│   └── imageLoader.js            # Массовая загрузка
└── config/
    └── firebase.js               # ✏️ Обновлен (добавлен Storage)

functions/                         # Cloud Functions (опционально)
├── index.js
└── package.json

docs/
├── QUICK_START_IMAGES.md
├── PEXELS_FIREBASE_SETUP.md
└── MIGRATION_GUIDE.md
```

### Удалены (не работали)

```
❌ src/services/unsplashService.js
❌ src/services/yandexImageService.js
```

## 🎨 Как использовать

### В компонентах (уже работает)

```jsx
import { useThematicImageUrl } from "../hooks/useThematicImageUrl";

function ServiceCard({ categoryId, service }) {
  const { url, loading } = useThematicImageUrl(categoryId, service);

  return <div>{!loading && url && <img src={url} alt={service.title} />}</div>;
}
```

### Массовая загрузка (консоль браузера)

```javascript
// Статус загрузки
await window.imageLoader.checkImagesStatus();

// Одна категория
await window.imageLoader.loadCategoryImages("plumbing");

// Все категории
await window.imageLoader.loadAllImages();
```

## 🔧 Настройка ключевых слов

Файл: `src/data/serviceThematicImages.js`

```javascript
const THEMATIC_KEYWORDS = {
  "plumbing.sink-installation": "sink,bathroom",
  "electrical.outlet-installation": "outlet,electrical",
  // ...
};
```

## 📊 Лимиты

### Pexels API (бесплатно)

- ✅ 200 запросов/час
- ✅ Неограниченно в месяц
- ✅ Без CORS проблем

### Firebase Storage (бесплатно)

- ✅ 5 GB хранилища
- ✅ 1 GB/день трафика
- ✅ 50,000 операций чтения/день

## 🐛 Troubleshooting

### Изображения не загружаются

1. Проверить `.env` → `VITE_PEXELS_API_KEY`
2. Перезапустить `npm run dev`
3. Проверить консоль браузера (F12)

### Ошибка Firebase Storage

1. Firebase Console → Storage → Rules
2. Проверить правила доступа (см. выше)

### Ошибка "window.imageLoader is undefined"

1. Перезагрузить страницу
2. Проверить импорт в `src/main.jsx`

## 🎯 Преимущества

| Критерий   | Старый подход  | Новый подход |
| ---------- | -------------- | ------------ |
| CORS       | ❌ Ошибки      | ✅ Работает  |
| Скорость   | 🐌 Медленно    | ⚡ Быстро    |
| Надежность | ❌ Не работает | ✅ Работает  |
| Настройка  | 😰 Сложная     | 😊 Простая   |
| Стоимость  | 💰 Платно      | 🆓 Бесплатно |

## 📞 Поддержка

При проблемах проверить:

1. Консоль браузера (F12)
2. Firebase Console → Storage
3. Документацию в `docs/`

## 🚀 Дополнительно: Cloud Functions

Для автоматического обновления изображений раз в неделю:

```bash
cd functions
npm install
firebase deploy --only functions
```

Подробнее: [PEXELS_FIREBASE_SETUP.md](docs/PEXELS_FIREBASE_SETUP.md)
