# Сканер утечек секретов

CLI-инструмент, который сканирует исходный код на случайно закоммиченные секреты: API-ключи, токены, пароли и приватные ключи.

---

## Быстрый старт (среда разработки)

Запустите эти команды из корня проекта, чтобы продемонстрировать все варианты вывода:

```bash
# 0) Установить зависимости
npm install

# 1) Собрать UI-бандл HTML-отчета
npm run build:report

# 2) CLI-вывод (читаемый человеком)
# test-project содержит преднамеренные HIGH-находки, поэтому код выхода будет 1
npm run dev -- scan ./test-project

# 3) JSON-вывод (для машинной обработки)
npm run dev -- scan ./test-project --json

# 4) Открыть веб-отчет
# генерируется в reports/security-report.html на шаге 2 (надо нежать на security-report.html)
npx serve reports
```

Затем откройте URL, который выведет `serve`, и перейдите к:

- `/security-report.html` для интерактивного отчета
- `/report-data.json` для сырых данных сканирования

---

## GitLab CI (test-project)

В репозитории добавлен демонстрационный пайплайн:

- `test-project/.gitlab-ci.yml`

Job `secret_scan_should_fail` запускает сканирование `./test-project` и падает, если найдены `HIGH`-секреты (в `test-project` они есть намеренно).

Команды для локального теста падения через `gitlab-ci-local`:

```bash
# 0) Нужен Docker (gitlab-ci-local запускает image из .gitlab-ci.yml)
docker --version

# 1) Установить gitlab-ci-local (один из вариантов)
npm i -g gitlab-ci-local

# 2) Запустить только job, который должен упасть
gitlab-ci-local --file test-project/.gitlab-ci.yml secret_scan_should_fail

# 3) Проверить код завершения (ожидается 1)
echo $?
```

---

## Возможности

- Обнаружение по regex для известных шаблонов секретов (AWS, GitHub, Stripe, JWT и т.д.)
- Обнаружение по ключевым словам для подозрительных присваиваний (`password`, `api_key`, `token` и т.д.)
- Анализ энтропии для поиска случайно выглядящих строк, которые могут быть секретами
- Классификация риска: `HIGH`, `MEDIUM`, `LOW`
- CLI-вывод в стиле ESLint с группировкой по файлам и цветами по критичности
- Сводка сканирования с количеством находок по уровням критичности
- Вывод JSON-отчета
- Интерактивный HTML-отчет с карточками сводки, сортируемой таблицей, группировкой по файлам, темной темой и поиском
- Использование в CI/CD

---

## Требования

- Node.js 18+
- npm

---

## Установка

```bash
git clone <repo-url>
cd secrets.ts
npm install
npm run build
```

Чтобы использовать команду `secret-scanner` глобально:

```bash
npm link
```

---

## Использование

### Базовое сканирование

```bash
secret-scanner scan ./path/to/project
```

Сканирует все файлы `.ts`, `.js`, `.json`, `.env`, `.yml`, `.yaml` и выводит отчет в стиле ESLint в терминал.

**Пример вывода:**

```
src/config.ts
  42:1  error    aws access key         secret/aws-access-key
  88:1  warning  keyword match          secret/keyword-match

src/api/client.ts
  15:1  error    github token           secret/github-token

✖ 3 problems (2 errors, 1 warning)

Scan Summary
────────────────────────────────────────
Scan completed in   0.84s
Files scanned:      64
Secrets found:      3

Severity breakdown:
  HIGH       2
  MEDIUM     1
  LOW        0

Data:               reports/report-data.json
HTML report:        reports/security-report.html
```

### JSON-вывод

```bash
secret-scanner scan ./path/to/project --json
```

Печатает JSON-отчет в stdout. Удобно для пайпов в другие инструменты или CI-пайплайны.

```json
{
  "scannedAt": "2026-03-07T10:00:00.000Z",
  "totalFindings": 3,
  "summary": { "HIGH": 2, "MEDIUM": 1, "LOW": 0 },
  "findings": [
    {
      "filePath": "/project/src/config.ts",
      "line": 42,
      "content": "const AWS_KEY = 'AKIAIOSFODNN7EXAMPLE'",
      "type": "AWS_ACCESS_KEY",
      "risk": "HIGH",
      "recommendation": "Rotate this key immediately and remove it from source code."
    }
  ]
}
```

### Пользовательские правила

```bash
secret-scanner scan ./path/to/project --rules ./my-rules.yml
```

Укажите YAML-файл с дополнительными regex-правилами, чтобы расширить набор правил по умолчанию.

---

## HTML-отчет

После каждого сканирования инструмент генерирует интерактивный HTML-отчет в папке `reports/`.

### Подготовка (один раз)

Перед использованием соберите UI отчета:

```bash
npm run build:report
```

Эта команда компилирует React-приложение в `report-ui/dist/`. После этого каждое сканирование автоматически копирует собранные файлы в `reports/` рядом с JSON-данными.

### Открытие отчета

```bash
# После запуска сканирования откройте HTML-файл напрямую в браузере:
open reports/security-report.html        # macOS
start reports/security-report.html       # Windows
xdg-open reports/security-report.html    # Linux
```

### Возможности отчета

| Возможность | Описание |
|---|---|
| Карточки сводки | Общее количество, High, Medium, Low |
| Сортируемая таблица | Нажмите на заголовок любого столбца для сортировки |
| Группировка по файлам | Переключитесь в режим "By File", чтобы сгруппировать находки по путям файлов |
| Поиск | Фильтрация по пути файла, типу секрета или фрагменту кода |
| Темная тема | Переключатель в правом верхнем углу |

> Отчет читает `report-data.json` из той же папки. Оба файла должны находиться в одном каталоге.

---

## Методы обнаружения

### 1. Regex-детектор

Сопоставляет известные шаблоны секретов с каждой строкой в каждом файле.

| Правило | Тип | Риск |
|---|---|---|
| AWS access key | `AKIA...` | HIGH |
| AWS secret key | 40-символьная base64-строка | HIGH |
| GitHub token | `ghp_...` | HIGH |
| GitHub OAuth token | `gho_...` | HIGH |
| Заголовок приватного ключа | `-----BEGIN ... PRIVATE KEY-----` | HIGH |
| JWT token | `eyJ...eyJ...` | HIGH |
| Stripe live key | `sk_live_...` | HIGH |
| SendGrid API key | `SG....` | HIGH |
| Slack token | `xox[baprs]-...` | HIGH |
| Generic API key | `api_key = "..."` | MEDIUM |

### 2. Детектор ключевых слов

Помечает строки, содержащие подозрительные имена переменных (`password`, `secret`, `token`, `api_key`, `access_token`, `client_secret` и т.д.), если в строке также есть присваивание с нетривиальным значением.

Риск: `MEDIUM`

### 3. Детектор энтропии

Определяет строки с высокой энтропией (16+ символов), взятые в кавычки в исходном коде, на основе анализа энтропии Шеннона. Находит секреты, которые не соответствуют известным шаблонам.

Риск: `LOW`

---

## Сканируемые типы файлов

`.ts` `.js` `.env` `.json` `.yml` `.yaml`, а также любой файл, чье имя начинается с `.env` (например, `.env.local`, `.env.production`).

Эти директории всегда пропускаются: `node_modules`, `dist`, `.git`, `coverage`, `.next`.

---

## Коды выхода

| Код | Значение |
|---|---|
| `0` | Сканирование завершено, находок с риском HIGH нет |
| `1` | Обнаружена находка HIGH (удобно для падения CI-сборки) |
| `1` | Ошибка сканирования (файл не найден и т.д.) |

---

## Интеграция с CI

```yaml
# Пример для GitHub Actions
- name: Scan for secrets
  run: |
    npm install
    npm run build
    node dist/cli/index.js scan .
```

Процесс завершится с кодом `1`, если найдены секреты уровня `HIGH`, из-за чего CI-задача автоматически завершится с ошибкой.

---

## Структура проекта

```
secrets.ts/
├── src/
│   ├── cli/           # Точка входа CLI (Commander)
│   ├── scanner/       # Поиск файлов и их загрузка
│   ├── detectors/     # Regex, keyword, entropy детекторы
│   ├── analysis/      # Классификация риска и рекомендации
│   ├── rules/         # Правила по умолчанию
│   ├── report/        # CLI-репортер, JSON-репортер, сводка, копирование HTML
│   ├── types/         # Общие TypeScript-типы
│   └── utils/         # Фильтр расширений файлов, калькулятор энтропии
├── report-ui/         # HTML-отчет на React + Vite + Tailwind
├── reports/           # Сгенерированный вывод (создается во время сканирования)
│   ├── report-data.json
│   ├── security-report.html
│   └── assets/
└── package.json
```

---

## Скрипты

| Команда | Описание |
|---|---|
| `npm run build` | Компилирует TypeScript CLI в `dist/` |
| `npm run build:report` | Устанавливает зависимости и собирает React UI отчета |
| `npm run dev` | Запускает CLI напрямую через ts-node (без шага сборки) |
| `npm start` | Запускает скомпилированный CLI |
