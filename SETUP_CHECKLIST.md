# ✅ Чеклист настройки тематических изображений

## 📋 Что нужно сделать

### ☐ 1. Получить Pexels API ключ (2 минуты)

1. Перейти на https://www.pexels.com/api/
2. Нажать "Get Started"
3. Зарегистрироваться (можно через Google)
4. Скопировать API Key

### ☐ 2. Добавить ключ в .env (1 минута)

Открыть файл `.env` и добавить:

```env
VITE_PEXELS_API_KEY=твой-ключ-здесь
```

Если файла `.env` нет - скопировать из `.env.example`:

```bash
cp .env.example .env
```

### ☐ 3. Настроить Firebase Storage (3 минуты)

#### 3.1 Включить Storage

1. Открыть https://console.firebase.google.com
2. Выбрать свой проект
3. Меню слева → Storage
4. Нажать "Get Started"
5. Выбрать "Start in production mode"
6. Выбрать регион: `europe-west1` (или ближайший)
7. Нажать "Done"

#### 3.2 Настроить правила доступа

1. В Storage перейти на вкладку "Rules"
2. Заменить содержимое на:

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

3. Нажать "Publish"

### ☐ 4. Перезапустить проект (1 минута)

```bash
# Остановить текущий процесс (Ctrl+C)
# Запустить заново
npm run dev
```

### ☐ 5. Загрузить изображения (10-15 минут)

#### Вариант A: Все категории сразу

1. Открыть сайт в браузере
2. Открыть консоль (F12 или Cmd+Option+I)
3. Выполнить:

```javascript
await window.imageLoader.loadAllImages();
```

4. Дождаться завершения (~10-15 минут)

#### Вариант B: По одной категории

```javascript
// Сначала проверить статус
await window.imageLoader.checkImagesStatus();

// Загрузить для конкретной категории
await window.imageLoader.loadCategoryImages("plumbing");
await window.imageLoader.loadCategoryImages("electrical");
await window.imageLoader.loadCategoryImages("furniture");
// и т.д.
```

### ☐ 6. Проверить результат

1. Перейти на страницу категории (например, /services/plumbing)
2. Убедиться, что изображения загружаются
3. Проверить Firebase Console → Storage → images/

## 🎉 Готово!

Теперь:

- ✅ Изображения загружаются автоматически
- ✅ Кешируются в Firebase Storage
- ✅ Нет CORS ошибок
- ✅ Быстрая загрузка

## 🔍 Проверка работы

### Проверить статус загрузки

```javascript
await window.imageLoader.checkImagesStatus();
```

Должна появиться таблица:

```
┌─────────────┬───────┬────────┬─────────┬────────────┐
│ categoryId  │ total │ loaded │ missing │ percentage │
├─────────────┼───────┼────────┼─────────┼────────────┤
│ plumbing    │   27  │   27   │    0    │    100     │
│ electrical  │   25  │   25   │    0    │    100     │
│ ...         │  ...  │  ...   │   ...   │    ...     │
└─────────────┴───────┴────────┴─────────┴────────────┘
```

### Проверить Firebase Storage

1. Firebase Console → Storage
2. Должна быть папка `images/`
3. Внутри папки для каждой категории
4. В каждой папке файлы вида `service-id-timestamp.jpg`

## ❓ Что делать если что-то не работает

### Ошибка "VITE_PEXELS_API_KEY не установлен"

→ Проверить `.env` файл и перезапустить `npm run dev`

### Ошибка "window.imageLoader is undefined"

→ Перезагрузить страницу в браузере

### Ошибка Firebase Storage

→ Проверить правила доступа в Firebase Console → Storage → Rules

### Изображения не загружаются

→ Открыть консоль браузера (F12) и посмотреть ошибки

### Ошибка "Failed to fetch"

→ Проверить интернет-соединение и доступность Pexels API

## 📚 Дополнительная информация

- **Быстрый старт**: `docs/QUICK_START_IMAGES.md`
- **Полная настройка**: `docs/PEXELS_FIREBASE_SETUP.md`
- **Что изменилось**: `docs/MIGRATION_GUIDE.md`
- **Общая информация**: `IMAGES_README.md`

## 🚀 Опционально: Cloud Functions

Для автоматического обновления изображений раз в неделю:

```bash
cd functions
npm install
firebase deploy --only functions
```

Подробнее в `docs/PEXELS_FIREBASE_SETUP.md`

## 💡 Полезные команды

```javascript
// Проверить статус
await window.imageLoader.checkImagesStatus();

// Загрузить одну категорию
await window.imageLoader.loadCategoryImages("plumbing");

// Загрузить все
await window.imageLoader.loadAllImages();
```

## 📞 Нужна помощь?

1. Проверить консоль браузера (F12)
2. Проверить Firebase Console
3. Прочитать документацию в `docs/`
4. Проверить `.env` файл
