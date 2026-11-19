# IDOLVERSE — Frontend MVP (этап 3)

IDOLVERSE — клиентское веб-приложение-каталог исполнителей и музыкальных групп K-pop, C-pop и J-pop. Этот репозиторий содержит самостоятельный Frontend MVP: интерфейс работает на локальных демонстрационных данных и `localStorage`, без зависимости от готовности backend.

## Возможности MVP

- **Главная страница:** обзор проекта, подборки новостей, популярных артистов и музыкальных групп.
- **Каталог айдолов:** поиск по имени, группе, стране и роли; фильтрация по K-pop / C-pop / J-pop; сброс фильтров; карточки и пустое состояние.
- **Профиль артиста:** биографическая информация, группа, дискография и связанные материалы.
- **Каталог групп и профиль группы:** поиск и фильтрация коллективов, переход к подробной странице группы.
- **Новости:** демонстрационная лента новостей с категориями, датами и ссылками на источники там, где они предусмотрены.
- **Обратная связь:** форма предложения исправления с клиентской проверкой имени, email и описания; успешные обращения сохраняются в `localStorage`.
- **Кабинет администратора:** отдельный маршрут `/admin`, сводка обращений, поиск и фильтры, статусы обработки, внутренние заметки, удаление обращений и редактирование профилей артистов.
- **Авторизация администратора:** демонстрационный вход из иконки пользователя в шапке сайта. Обычным посетителям регистрация и личный кабинет не предоставляются. После входа администратора открывается `/admin`.

> Авторизация и хранение данных в этом MVP демонстрационные. `localStorage` не обеспечивает серверную безопасность, синхронизацию между устройствами или защищённое хранение учётных данных. Для production потребуется backend, база данных и серверная проверка ролей.

## Технологический стек

- React 18 + TypeScript
- Vite 6
- Redux Toolkit + React Redux
- React Router 6
- Vitest, Testing Library, jsdom
- CSS, Lucide React

## Требования

- Node.js 20 или новее
- npm

## Установка и запуск

```bash
npm install
npm run dev
```

Vite выведет локальный адрес, обычно `http://localhost:5173`.

## Проверка качества

```bash
npm test       # запуск unit- и компонентных тестов
npm run build  # проверка TypeScript и production-сборка
npm run preview
```

## Основные пользовательские сценарии

1. **Найти артиста:** открыть каталог → ввести имя, группу или страну → выбрать направление → открыть карточку артиста.
2. **Изучить группу и участника:** открыть каталог групп → найти коллектив → перейти на страницу группы → открыть профиль участника и изучить его информацию и дискографию.
3. **Отправить обращение:** открыть «Обратную связь» → заполнить имя, email и описание → пройти клиентскую валидацию → отправить форму → увидеть подтверждение. Обращение сохраняется локально и отображается в административной панели в том же браузере.

## Административный сценарий

1. Нажать иконку пользователя в шапке публичного сайта.
2. Ввести демонстрационные данные администратора.
3. После успешного входа перейти в кабинет `/admin`.
4. Просмотреть входящие обращения, изменить их статус или добавить внутреннюю заметку; либо найти артиста и отредактировать его карточку.
5. Выйти из кабинета, чтобы завершить локальную административную сессию.

Демонстрационная учётная запись:

- Email: `admin@idolverse.com`
- Пароль: `Admin123!`

Не используйте эти демонстрационные данные для реальных систем.

## Структура проекта

```text
src/
  app/                 Redux store и типизированные hooks
  components/          Общий Layout и переиспользуемые UI-компоненты
  data/                Локальные JSON-подобные mock-данные артистов, групп и новостей
  features/
    idols/             Redux slice, загрузка и состояние каталога
    corrections/       Redux slice обращений и локальное сохранение
  pages/               Главная, каталоги, профили, новости, обратная связь, админ-панель
  test/                Настройка тестовой среды
  utils/               Поиск, фильтрация и валидация форм
```

## Состояния интерфейса

- Каталог айдолов показывает состояние загрузки, ошибку с возможностью повторить загрузку и пустой результат поиска.
- Каталоги айдолов и групп показывают пустое состояние, если фильтры не вернули результатов.
- Форма обратной связи показывает ошибки полей и подтверждение успешной отправки.
- Административный маршрут не показывает рабочую панель без локальной административной сессии.

## Локальное хранение

- `idolverse-idols` — локальные изменения каталога артистов.
- `idolverse-corrections` — отправленные обращения, статусы и внутренние заметки.
- `idolverse-current-user` и `idolverse-current-role` — демонстрационная сессия администратора.

Чтобы сбросить демонстрационные данные, удалите соответствующие ключи в DevTools → Application → Local Storage.

## Тесты

Тесты покрывают:
- поиск и фильтрацию артистов;
- валидацию формы обратной связи;
- reducers и состояния асинхронной загрузки каталога;
- отображение карточки артиста и переход к профилю;
- успешную отправку обращения, сохранение в локальное хранилище и показ подтверждения;
- ограничение доступа к административной панели.

## Данные и интеграция с backend

На этапе 3 используются локальные mock-данные и `localStorage`. Каталог загружается через Redux Toolkit `createAsyncThunk`, что оставляет точку для будущей интеграции с API. Серверная запись, серверная валидация, реальная авторизация и постоянная база данных относятся к следующему этапу.

Предварительные направления API для следующего этапа: `GET /idols`, `GET /idols/:id`, `GET /groups/:id`, `GET /events/:id`, `GET /albums`, `GET /news`, `GET /search?q=...`, `POST /corrections`.

## Деплой на GitHub Pages

В проект добавлен GitHub Actions workflow `.github/workflows/deploy.yml`. Он автоматически устанавливает зависимости, запускает тесты, выполняет production-сборку Vite, добавляет SPA fallback и публикует папку `dist`.

1. Отправьте проект в GitHub-репозиторий в ветку `main`.
2. Откройте **Settings → Pages**.
3. В разделе **Build and deployment → Source** выберите **GitHub Actions** (не `Deploy from a branch` и не папку `/docs`).
4. Откройте вкладку **Actions** и дождитесь успешного выполнения workflow **Deploy IDOLVERSE to GitHub Pages**.
5. После успешного деплоя ссылка появится в **Settings → Pages** и в окружении `github-pages`.

Workflow автоматически определяет base path репозитория, поэтому приложение поддерживает как проектный адрес `https://<owner>.github.io/<repository>/`, так и пользовательский адрес `https://<owner>.github.io/`. Вложенные маршруты поддерживаются через `dist/404.html`.

Для локальной разработки используется корневой адрес `/`. Путь для GitHub Pages задаётся в workflow через `VITE_BASE_PATH`.


## Code style and review

- TypeScript strict mode is enabled; avoid `any` and implicit types.
- Use named exports for page and reusable component modules.
- Keep React components focused on rendering and move reusable logic into `src/utils/`.
- Use typed Redux hooks from `src/app/hooks.ts`.
- Keep shared application state in Redux slices and component-only state in React hooks.
- Use `assetUrl()` for files stored in `public/` so paths work on GitHub Pages project sites.
- Use `readStorage()` / `writeStorage()` for defensive access to localStorage data.
- Formatting is configured with Prettier (`.prettierrc.json`, `.editorconfig`).

Run `npm run format` to format the project and `npm run format:check` to verify formatting.


### Vitest и конфигурация сборки

Конфигурации Vite и Vitest разделены: `vite.config.ts` отвечает за production/dev-сборку, а `vitest.config.ts` — за тестовую среду. Это предотвращает конфликт типов плагинов при разных экземплярах Vite в дереве зависимостей. Команда `npm test` автоматически использует `vitest.config.ts`.

## UX update (v42)
- Removed duplicated footer feedback link and redundant page copy.
- Added an IDOLVERSE IV monogram favicon.
- Simplified catalog filters and added search/filter controls to News.
- Added click-to-open photo lightboxes on idol and group galleries.
- Simplified the feedback form and admin navigation; moved request counts into the inbox.
- Enabled native lazy loading and asynchronous image decoding, added image fade-in states, and optimized local JPEG assets while preserving image orientation.
