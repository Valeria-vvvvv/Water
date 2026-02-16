# Настройка автоматической загрузки тематических изображений

## Обзор решения

Вместо проблемных Unsplash и Yandex API используется связка:

- **Pexels API** - бесплатный поиск фото без CORS проблем
- **Firebase Storage** - хранение загруженных изображений
- **Cloud Functions** - автоматическая загрузка и обновление

## Преимущества

✅ Нет CORS ошибок  
✅ Изображения кешируются в Storage (быстрая загрузка)  
✅ Автоматическое обновление раз в неделю  
✅ Бесплатно до 200 запросов/час (Pexels)  
✅ Публичные URL для изображений

## Шаг 1: Получить Pexels API ключ

1. Перейти на https://www.pexels.com/api/
2. Нажать "Get Started"
3. Зарегистрироваться или войти
4. Скопировать API Key

## Шаг 2: Настроить переменные окружения

Добавить в `.env`:

```env
VITE_PEXELS_API_KEY=your-pexels-api-key-here
```

## Шаг 3: Настроить Firebase Storage

### 3.1 Включить Storage в Firebase Console

1. Открыть Firebase Console: https://console.firebase.google.com
2. Выбрать проект
3. Перейти в "Storage" → "Get Started"
4. Выбрать режим (рекомендуется "Start in production mode")
5. Выбрать регион (например, europe-west1)

### 3.2 Настроить правила доступа

В Firebase Console → Storage → Rules добавить:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Публичное чтение для папки images
    match /images/{categoryId}/{imageId} {
      allow read: if true;
      allow write: if request.auth != null; // только авторизованные
    }
  }
}
```

## Шаг 4: Установить Firebase CLI (если еще не установлен)

```bash
npm install -g firebase-tools
firebase login
```

## Шаг 5: Инициализировать Firebase Functions

```bash
# В корне проекта
firebase init functions

# Выбрать:
# - Use an existing project (выбрать свой проект)
# - JavaScript
# - ESLint: No (или Yes, если нужен)
# - Install dependencies: Yes
```

## Шаг 6: Установить зависимости для функций

```bash
cd functions
npm install
cd ..
```

## Шаг 7: Настроить Pexels API ключ для Cloud Functions

```bash
firebase functions:config:set pexels.apikey="your-pexels-api-key"
```

## Шаг 8: Деплой Cloud Functions

```bash
firebase deploy --only functions
```

После деплоя вы получите URL функции, например:

```
https://us-central1-your-project.cloudfunctions.net/loadServiceImages
```

## Шаг 9: Загрузить изображения

### Вариант A: Через HTTP запрос

```bash
curl -X POST https://your-region-your-project.cloudfunctions.net/loadServiceImages \
  -H "Content-Type: application/json" \
  -d '{"pexelsApiKey": "your-pexels-api-key"}'
```

### Вариант B: Для конкретной категории

```bash
curl -X POST https://your-region-your-project.cloudfunctions.net/loadServiceImages \
  -H "Content-Type: application/json" \
  -d '{"pexelsApiKey": "your-pexels-api-key", "categoryId": "plumbing"}'
```

### Вариант C: Через код (создать утилиту)

Создать файл `scripts/loadImages.js`:

```javascript
const fetch = require("node-fetch");

const FUNCTION_URL =
  "https://your-region-your-project.cloudfunctions.net/loadServiceImages";
const PEXELS_API_KEY = "your-pexels-api-key";

async function loadImages(categoryId = null) {
  const response = await fetch(FUNCTION_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      pexelsApiKey: PEXELS_API_KEY,
      categoryId,
    }),
  });

  const result = await response.json();
  console.log(result);
}

loadImages();
```

Запустить:

```bash
node scripts/loadImages.js
```

## Как это работает

1. **Первая загрузка страницы услуги:**
   - Хук `useThematicImageUrl` проверяет Firebase Storage
   - Если изображения нет → запрос к Pexels API
   - Скачивает изображение и загружает в Storage
   - Возвращает публичный URL

2. **Последующие загрузки:**
   - Изображение уже в Storage
   - Мгновенная загрузка по публичному URL
   - Нет запросов к Pexels API

3. **Автоматическое обновление:**
   - Cloud Function запускается раз в неделю
   - Обновляет устаревшие изображения
   - Добавляет изображения для новых услуг

## Структура в Storage

```
images/
├── plumbing/
│   ├── sink-installation-1234567890.jpg
│   ├── toilet-installation-1234567891.jpg
│   └── ...
├── electrical/
│   ├── outlet-installation-1234567892.jpg
│   └── ...
└── furniture/
    └── ...
```

## Лимиты и ограничения

### Pexels API (бесплатный план):

- 200 запросов в час
- Неограниченное количество запросов в месяц
- Требуется атрибуция (автоматически сохраняется)

### Firebase Storage (бесплатный план):

- 5 GB хранилища
- 1 GB/день исходящего трафика
- 50,000 операций чтения/день

## Troubleshooting

### Ошибка CORS

✅ Решено! Pexels API не имеет CORS ограничений

### Изображения не загружаются

1. Проверить правила Storage (должны разрешать публичное чтение)
2. Проверить VITE_PEXELS_API_KEY в .env
3. Проверить консоль браузера на ошибки

### Cloud Function не работает

1. Проверить деплой: `firebase deploy --only functions`
2. Проверить логи: `firebase functions:log`
3. Проверить конфигурацию: `firebase functions:config:get`

## Удаление старых сервисов

Можно удалить файлы:

- `src/services/unsplashService.js`
- `src/services/yandexImageService.js`

Они больше не используются.

## Дополнительно: Firestore структура

Если хотите хранить метаданные изображений в Firestore:

```javascript
// Коллекция: services
{
  id: "sink-installation",
  categoryId: "plumbing",
  title: "Установка раковины",
  imageUrl: "https://storage.googleapis.com/...",
  imageSource: "pexels",
  imagePhotographer: "John Doe",
  updatedAt: Timestamp
}
```

## Контакты

При возникновении проблем:

1. Проверить документацию Pexels: https://www.pexels.com/api/documentation/
2. Проверить документацию Firebase Storage: https://firebase.google.com/docs/storage
3. Проверить логи Cloud Functions: `firebase functions:log`
