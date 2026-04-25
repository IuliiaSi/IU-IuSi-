# Честная оценка

Мобильное приложение для второго мнения по рекомендациям автосервиса.

## Запуск

### Через Replit (рекомендуемый для этого репозитория)

В корне репозитория уже настроен `.replit` под запуск AntiScam как полноценного приложения:

- frontend собирается в `frontend/dist`
- backend запускается как единый веб-процесс
- API доступен по `/api/*`
- SPA отдается тем же процессом на внешнем URL Replit

Перед запуском добавь в Replit Secrets:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

После этого нажми **Run**.

В production-режиме auth работает в гибридной схеме:
- frontend логинится в Supabase напрямую (через `supabase-js`);
- backend остаётся источником проверок доступа для бизнес-эндпоинтов (`entries`, `cars`, `analysis`, `access`).

### Через Docker (рекомендуемый)

```bash
docker-compose up --build
```

После запуска:
- Frontend: http://localhost:8080
- Backend API: http://localhost:3000/api

Для backend нужны переменные окружения Supabase (`SUPABASE_URL`, `SUPABASE_ANON_KEY`).

### Локальная разработка

**Backend:**

```bash
cd backend
npm install
# optional: copy env template
cp .env.example .env
npm run start:dev
```

Требуются переменные Supabase для email/password авторизации:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`

**Frontend:**

```bash
cd frontend
npm install
# optional: copy env template
cp .env.example .env
npm run dev
```

Откроется на `http://localhost:5173`.

### Сборка на мобильный телефон (Capacitor)

Приложение собирается в нативный проект iOS или Android через Capacitor.
Vue-приложение компилируется в статику, которая затем оборачивается в нативную оболочку.

#### Что нужно заранее установить

**Для iOS:**
- macOS (сборка iOS возможна только на Mac)
- Xcode — бесплатно из App Store
- CocoaPods — `sudo gem install cocoapods`
- Apple ID (бесплатный подойдёт для запуска на своём устройстве)

**Для Android:**
- Android Studio — https://developer.android.com/studio
- Android SDK (ставится вместе с Android Studio)
- На телефоне: включить режим разработчика и USB-отладку

#### Сборка для iOS

```bash
cd frontend

# 1. Установить зависимости
npm install

# 2. Собрать Vue-приложение в папку dist/
npm run build

# 3. Добавить iOS-платформу (только первый раз)
npx cap add ios

# 4. Скопировать билд в нативный проект
npx cap sync ios

# 5. Открыть проект в Xcode
npx cap open ios
```

В Xcode:
1. Подключи iPhone кабелем или выбери симулятор в верхней панели
2. Перейди в раздел **Signing & Capabilities** и выбери свой Team (Apple ID)
3. Нажми **Run** (Cmd+R)

#### Сборка для Android

```bash
cd frontend

# 1. Установить зависимости
npm install

# 2. Собрать Vue-приложение
npm run build

# 3. Добавить Android-платформу (только первый раз)
npx cap add android

# 4. Скопировать билд в нативный проект
npx cap sync android

# 5. Открыть проект в Android Studio
npx cap open android
```

В Android Studio:
1. Подключи телефон по USB или запусти эмулятор
2. Нажми **Run** (зелёный треугольник)

#### Обновление после изменений в коде

Если ты поменял что-то во фронтенде и хочешь обновить сборку на телефоне:

```bash
cd frontend
npm run build
npx cap sync
```

Затем заново запусти проект в Xcode или Android Studio.

#### Быстрый просмотр на телефоне без нативной сборки

Если не хочешь ставить Xcode/Android Studio, можно просто открыть приложение в мобильном браузере.

Запусти проект через Docker:

```bash
docker-compose up --build
```

Узнай IP своего компьютера:

```bash
# macOS
ipconfig getifaddr en0
```

Открой на телефоне (телефон и компьютер должны быть в одной Wi-Fi сети):

```
http://<IP-компьютера>:8080
```

## Структура проекта

```
├── docker-compose.yml
├── backend/           # NestJS + Supabase
│   ├── Dockerfile
│   └── src/
│       ├── auth/      # Авторизация (Supabase email/password + legacy mock phone)
│       ├── cars/      # Профиль автомобиля
│       └── analysis/  # Анализ списка работ
└── frontend/          # Vue 3 + Vite + Pinia
    ├── Dockerfile
    ├── capacitor.config.ts
    └── src/
        ├── views/         # 9 экранов приложения
        ├── components/    # UI-компоненты
        ├── stores/        # Pinia store
        ├── composables/   # Композиции Vue
        ├── data/          # Каталог работ, маппинг, мок-данные
        └── styles/        # Дизайн-токены, базовые стили
```

## Что можно настроить

### 1. Название продукта
Файл: `frontend/src/data/product-copy.ts` — поле `brandName`

### 2. Тексты экранов
Файл: `frontend/src/data/product-copy.ts` — все тексты организованы по экранам

### 3. Цвета и дизайн-токены
Файл: `frontend/src/styles/tokens.css` — CSS custom properties:
- `--primary`, `--secondary` — основные цвета
- `--bg`, `--surface-low`, `--surface-high` — фоны
- `--text-primary`, `--text-secondary` — текст
- `--radius-*` — радиусы скругления
- `--font-display`, `--font-body` — шрифты

### 4. Каталог работ
Файлы:
- `frontend/src/data/job-catalog.ts`
- `backend/src/analysis/data/job-catalog.ts`

### 5. Маппинг правил и объяснений
Файлы:
- `frontend/src/data/rule-mapping.ts`
- `backend/src/analysis/data/rule-mapping.ts`

Каждая работа имеет: `group` (группа приоритета), `chip` (метка), `explanation` (объяснение).

### 6. Мок-результат для upload
Файлы:
- `frontend/src/data/mock-results.ts` — `mockUploadResult` и `exampleResult`
- `backend/src/analysis/data/mock-upload-result.ts`

## Flow приложения

Welcome → Login → Данные авто → Выбор метода → (Ручной ввод / Upload / Пример) → Анализ → Результат → Paywall

## Auth (Supabase, hybrid mode)

В стандартном user flow frontend использует прямой Supabase Auth (через `@supabase/supabase-js`):
- login/register выполняются напрямую из клиента;
- это снижает вероятность общего IP rate-limit bottleneck на backend.

Backend auth endpoints сохранены как совместимость/служебный слой:
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/auth/logout`

Для frontend auth необходимы:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Для backend auth-проверок необходимы:
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`

Обычные ошибки (неверный пароль, email занят и т.д.) **не** блокируют кнопку: можно сразу исправить ввод. Если Supabase сигнализирует о **лимите запросов** (например HTTP `429` или `over_request_rate`), показывается пояснение и включается таймаут кнопки на ~10 секунд, чтобы не усугублять rate limit.

## Replit production checklist

- Secrets в Replit:
  - `SUPABASE_URL`
  - `SUPABASE_ANON_KEY`
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
- Проверь, что frontend auth идёт напрямую в Supabase (без `/api/auth/*` в основном user flow).
- Проверь, что backend API (`/api/entries`, `/api/cars`, `/api/analysis`, `/api/access`) принимает Bearer token и валидирует права на сервере.
- Для локального frontend используй `frontend/.env.example` как шаблон.

Технически `.replit` теперь валидирует наличие всех 4 env на старте, чтобы приложение не запускалось в полурабочем состоянии.

## Supabase: полная SQL-схема (одним файлом)

Для новой базы удобнее один раз выполнить в **SQL Editor** файл **`sql/0001_init.sql`**: таблицы `entries`, `cars`, `user_access`, RLS и индексы. Скрипт idempotent (повторный запуск не ломает схему).

Файл **`sql/mvp_security.sql`** оставлен для совместимости: в нём только `user_access` (этот блок входит в `0001_init.sql`).

## Entries (Supabase Table Editor)

Создай таблицу `entries` в Supabase с колонками:

- `id` bigint identity primary key
- `user_id` uuid not null
- `user_input` text not null
- `ai_response` text not null
- `created_at` timestamptz default now()

Рекомендуемый SQL:

```sql
create table if not exists public.entries (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  user_input text not null,
  ai_response text not null,
  created_at timestamptz not null default now()
);

alter table public.entries enable row level security;

create policy "entries_insert_own"
on public.entries
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "entries_select_own"
on public.entries
for select
to authenticated
using (auth.uid() = user_id);
```

## Cars (Supabase Table Editor)

Для endpoint'ов `/api/cars` создай таблицу `cars`:

- `id` uuid primary key default gen_random_uuid()
- `user_id` uuid not null
- `brand` text not null
- `model` text not null
- `year` int not null
- `mileage` int not null
- `created_at` timestamptz default now()

`/api/cars` требует Bearer access token.

Рекомендуемый SQL:

```sql
create extension if not exists pgcrypto;

create table if not exists public.cars (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  brand text not null,
  model text not null,
  year int not null,
  mileage int not null,
  created_at timestamptz not null default now()
);

alter table public.cars enable row level security;

create policy "cars_insert_own"
on public.cars
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "cars_select_own"
on public.cars
for select
to authenticated
using (auth.uid() = user_id);
```

## Security changes (MVP)

Базовые защитные изменения реализованы без переписывания архитектуры:

- `/success` теперь только информационная страница:
  - не выдает paid-доступ;
  - не пишет ничего в Supabase/БД;
  - показывает текст `Оплата почти завершена`;
  - содержит кнопку `Вернуться в приложение`.
- Логика paid-доступа больше не доверяется фронтенду:
  - добавлен backend endpoint `GET /api/access/me`;
  - источник правды: таблица `public.user_access` (`paid`, `role`) в Supabase;
  - клиент не может сам менять `paid/role` через API таблицы;
  - платная функция (история entries) проверяется на сервере.
- Добавлена защита от спама:
  - client-side cooldown 3 секунды на основном действии (ручной анализ);
  - server-side cooldown 3 секунды на `POST /api/analysis/manual`;
  - если слишком рано: `Подождите немного`.
- Перед основным действием теперь требуется подтверждение:
  - чекбокс `Я не робот` обязателен для ручного анализа;
  - проверка есть и на сервере (`humanConfirmed === true`).
- Секреты:
  - приватные ключи не используются во frontend-коде;
  - backend использует env (`SUPABASE_URL`, `SUPABASE_ANON_KEY`).

### SQL для статуса paid/role

- Полная схема (включая `user_access`): **`sql/0001_init.sql`**.
- Только `user_access` (если `entries`/`cars` уже созданы): **`sql/mvp_security.sql`**.

`user_access` и RLS на чтение своей строки; **запись `paid/role` с клиента запрещена** (`revoke` + отсутствие insert/update policies). Обновлять `paid/role` должна только доверенная серверная логика (webhook, Edge Function с service role, admin job), а не браузер.

### Manual test checklist

1. Открыть `/success` напрямую — paid-статус не должен измениться.
2. Попытаться получить paid-доступ без оплаты — доступ должен быть заблокирован.
3. Быстро нажать основную кнопку 10-20 раз — действие не должно выполняться чаще 1 раза в 3 секунды.
4. Нажать основное действие без `Я не робот` — действие должно быть заблокировано.
5. Подтвердить `Я не робот` и выполнить действие — действие должно работать.
6. Сделать много быстрых login attempts, пока Supabase начнёт отвечать rate limit — UI должен показать сообщение о временном ограничении и таймаут кнопки; при обычной ошибке (например неверный пароль) кнопка остаётся доступной.
7. Проверить, что бизнес-эндпоинты backend (`/api/entries`, `/api/cars`, `/api/access`) без валидного Bearer token возвращают отказ.
