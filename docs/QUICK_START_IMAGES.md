# Быстрый старт: Тематические изображения

## Самый простой способ (без Cloud Functions)

### 1. Получить Pexels API ключ

1. Перейти на https://www.pexels.com/api/
2. Нажать "Get Started" и зарегистрироваться
3. Скопировать API Key

### 2. Добавить ключ в .env

```env
VITE_PEXELS_API_KEY=ваш-ключ-здесь
```

### 3. Настроить Firebase Storage

1. Открыть Firebase Console: https://console.firebase.google.com
2. Выбрать проект → Storage → Get Started
3. Выбрать регион (например, europe-west1)
4. В Rules добавить:

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

### 4. Установить зависимости

```bash
npm install firebase
```

### 5. Запустить проект

```bash
npm run dev
```

### 6. Загрузить изображения через консоль браузера

Открыть консоль браузера (F12) и выполнить:

```javascript
// Проверить статус
await window.imageLoader.checkImagesStatus();

// Загрузить для одной категории (например, plumbing)
await window.imageLoader.loadCategoryImages("plumbing");

// Загрузить для всех категорий (займет ~10-15 минут)
await window.imageLoader.loadAllImages();
```

## Как это работает

1. При первом открытии страницы услуги:
   - Проверяется Firebase Storage
   - Если изображения нет → запрос к Pexels
   - Изображение загружается в Storage
   - Возвращается публичный URL

2. При последующих открытиях:
   - Изображение берется из Storage
   - Мгновенная загрузка

## Доступные категории

- `plumbing` - Сантехнические работы
- `electrical` - Электромонтажные работы
- `furniture` - Сборка мебели
- `handyman` - Муж на час
- `windows` - Ремонт окон
- `minor_repair` - Мелкий ремонт

## Лимиты Pexels API

- 200 запросов в час (бесплатно)
- Неограниченно в месяц
- Между запросами автоматическая задержка 2 секунды

## Troubleshooting

### Ошибка "VITE_PEXELS_API_KEY не установлен"

→ Добавить ключ в `.env` и перезапустить `npm run dev`

### Ошибка Firebase Storage

→ Проверить правила доступа в Firebase Console

### Изображения не загружаются

→ Открыть консоль браузера (F12) и проверить ошибки

## Альтернатива: Cloud Functions

Для автоматической загрузки и обновления см. `docs/PEXELS_FIREBASE_SETUP.md`
