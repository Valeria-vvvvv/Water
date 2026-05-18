# Чеклист настройки Supabase

## ✅ Выполнено

- [x] Установлен пакет `@supabase/supabase-js`
- [x] Удален пакет `firebase`
- [x] Создана конфигурация Supabase (`src/config/supabase.js`)
- [x] Обновлен сервис контактов для работы с Supabase
- [x] Удалены файлы Firebase (`src/config/firebase.js`, `functions/`)
- [x] Обновлены переменные окружения
- [x] Обновлена документация (README.md, БЫСТРЫЙ_СТАРТ.md)
- [x] Создан SQL скрипт для таблицы `supabase_contacts_table.sql`
- [x] Создана инструкция по настройке `SUPABASE_SETUP.md`

## 🔧 Требуется выполнить пользователю

### 1. Получить данные из Supabase

- [ ] Перейти в [Supabase Dashboard](https://supabase.com/dashboard/org/vxvvxpliirsqtldivvnl)
- [ ] Выбрать проект
- [ ] В **Settings** → **API** скопировать:
  - **URL** (Project URL)
  - **anon** public ключ (Project API keys)

### 2. Обновить .env файл

- [ ] Открыть файл `.env`
- [ ] Заменить значения:
  ```
  VITE_SUPABASE_URL=ваш_проект_url_из_supabase
  VITE_SUPABASE_ANON_KEY=ваш_anon_ключ_из_supabase
  ```

### 3. Создать таблицу в Supabase

- [ ] В Supabase Dashboard перейти в **Table Editor**
- [ ] Нажать **Create a new table**
- [ ] Использовать SQL из файла `supabase_contacts_table.sql`
- [ ] Убедиться, что RLS (Row Level Security) включен

### 4. Проверить работу

- [ ] Перезапустить проект: `npm run dev`
- [ ] Открыть страницу доставки воды
- [ ] Заполнить форму
- [ ] Проверить таблицу `contacts` в Supabase
- [ ] Убедиться, что пришло уведомление в Telegram

## 🐛 Возможные проблемы и решения

### Ошибка: "Supabase environment variables are not set"

**Решение:** Проверить `.env` файл и перезапустить `npm run dev`

### Ошибка: "insert violates row-level security policy"

**Решение:** Проверить настройки RLS в Supabase, убедиться что политика для анонимной вставки активна

### Данные не сохраняются

**Решение:**

1. Проверить консоль браузера на наличие ошибок
2. Убедиться, что таблица `contacts` существует в Supabase
3. Проверить структуру таблицы (должна соответствовать SQL скрипту)

### Форма не отправляется

**Решение:**

1. Проверить подключение к интернету
2. Проверить, что переменные окружения заполнены правильно
3. Проверить консоль браузера на наличие CORS ошибок

## 📞 Поддержка

Если возникли проблемы, проверьте:

1. Файл `SUPABASE_SETUP.md` - полная инструкция
2. Консоль браузера (F12) - ошибки JavaScript
3. Сеть (Network tab) - запросы к Supabase API
