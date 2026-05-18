# Настройка Supabase для формы доставки воды

## Шаг 1: Получение данных от Supabase

1. Перейдите в [Supabase Dashboard](https://supabase.com/dashboard/org/vxvvxpliirsqtldivvnl)
2. Выберите ваш проект
3. В левом меню перейдите в **Settings** → **API**
4. Скопируйте:
   - **URL** (Project URL)
   - **anon** public ключ (Project API keys)

## Шаг 2: Обновление переменных окружения

Откройте файл `.env` в корне проекта и замените значения:

```
VITE_SUPABASE_URL=ваш_проект_url_из_supabase
VITE_SUPABASE_ANON_KEY=ваш_anon_ключ_из_supabase
```

## Шаг 3: Создание таблицы в Supabase

1. В Supabase Dashboard перейдите в **Table Editor**
2. Нажмите **Create a new table**
3. Используйте SQL из файла `supabase_contacts_table.sql` или создайте таблицу вручную:

### Структура таблицы `contacts`:

- `id` (UUID, primary key, default: gen_random_uuid())
- `name` (text)
- `phone` (text, NOT NULL)
- `email` (text)
- `comment` (text)
- `source` (text)
- `status` (text, default: 'new')
- `created_at` (timestamp with time zone, default: now())
- `updated_at` (timestamp with time zone, default: now())

## Шаг 4: Настройка RLS (Row Level Security)

Таблица уже настроена с RLS в SQL скрипте. Убедитесь, что:

1. RLS включен для таблицы `contacts`
2. Есть политика для анонимной вставки данных
3. Есть политика для чтения данных аутентифицированными пользователями

## Шаг 5: Проверка работы

1. Перезапустите приложение: `npm run dev`
2. Откройте страницу доставки воды
3. Заполните форму и отправьте
4. Проверьте:
   - Данные появились в таблице `contacts` в Supabase
   - Пришло уведомление в Telegram (если настроено)

## Устранение неполадок

### Ошибка: "Supabase environment variables are not set"

- Проверьте, что переменные в `.env` файле заполнены правильно
- Убедитесь, что файл `.env` находится в корне проекта
- Перезапустите сервер разработки

### Ошибка: "insert violates row-level security policy"

- Проверьте настройки RLS в Supabase
- Убедитесь, что политика для анонимной вставки активна

### Данные не сохраняются

- Проверьте консоль браузера на наличие ошибок
- Убедитесь, что таблица `contacts` существует в Supabase
- Проверьте структуру таблицы (должна соответствовать SQL скрипту)

## Дополнительные настройки

### Включение уведомлений по email

В Supabase можно настроить триггеры для отправки email при новой заявке:

1. Перейдите в **Database** → **Triggers**
2. Создайте новый триггер на таблицу `contacts`
3. Настройте отправку email через Edge Functions

### Экспорт данных

Данные можно экспортировать из Supabase в формате CSV или JSON через интерфейс Table Editor.
