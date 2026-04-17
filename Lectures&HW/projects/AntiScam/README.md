# Честная оценка

Мобильное приложение для второго мнения по рекомендациям автосервиса.

## Запуск

### Через Docker (рекомендуемый)

```bash
docker-compose up --build
```

После запуска:
- Frontend: http://localhost:8080
- Backend API: http://localhost:3000/api
- MongoDB: localhost:27017

### Локальная разработка

**Backend:**

```bash
cd backend
npm install
# optional: copy env template
cp .env.example .env
npm run start:dev
```

Требуется MongoDB на `localhost:27017` и переменные Supabase для email/password авторизации.

**Frontend:**

```bash
cd frontend
npm install
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
├── backend/           # NestJS + MongoDB
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

## Auth API (Supabase)

Backend использует Supabase Auth для регистрации и логина по email/password.

Необходимые env в `backend/.env`:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`

Endpoints:

- `POST /api/auth/register`
  - body: `{ "email": "user@mail.com", "password": "secret123", "name": "Ivan" }`
- `POST /api/auth/login`
  - body: `{ "email": "user@mail.com", "password": "secret123" }`
- `GET /api/auth/me` (Bearer access token)
- `POST /api/auth/logout` (Bearer access token)

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
