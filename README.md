# IDOLVERSE — Frontend MVP (этап 3)

IDOLVERSE — клиентское веб-приложение-каталог исполнителей и музыкальных групп K-pop, C-pop и J-pop. Этот репозиторий содержит самостоятельный Frontend MVP: интерфейс работает на локальных демонстрационных данных и `localStorage`, без зависимости от готовности backend.

## Ссылки на проект

- **Опубликованный frontend:** https://matvey-karashpanov.github.io/idolverse-mvp/
- **GitHub-репозиторий:** https://github.com/matvey-karashpanov/idolverse-mvp

Отдельная ссылка на статический лендинг этапа 2 не приводится: в предоставленных материалах она не указана.

## Возможности MVP

- **Главная страница:** обзор проекта, подборки новостей, популярных артистов и музыкальных групп.
- **Каталог айдолов:** поиск по имени, группе, стране и роли; фильтрация по K-pop / C-pop / J-pop; сброс фильтров; карточки и пустое состояние.
- **Профиль артиста:** биографическая информация, группа, дискография и связанные материалы.
- **Каталог групп и профиль группы:** поиск и фильтрация коллективов, переход к подробной странице группы.
- **Новости:** демонстрационная лента новостей с категориями, датами и ссылками на источники там, где они предусмотрены.
- **Обратная связь:** форма предложения исправления с клиентской проверкой email и описания; имя/псевдоним необязательно. Успешные обращения сохраняются в `localStorage`.
- **Кабинет администратора:** отдельный маршрут `/admin`; управление артистами, группами и новостями, работа с обращениями, изменение статусов и внутренние заметки. Доступ и изменения реализованы на стороне клиента и хранятся локально.
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

`npm install` устанавливает зависимости по `package.json` и создаёт или обновляет `package-lock.json`. Lock-файл нужно добавить в Git вместе с исходным кодом: он фиксирует точные версии прямых и транзитивных зависимостей. После того как `package-lock.json` добавлен в репозиторий, для чистой и воспроизводимой установки используйте `npm ci`.

Vite выведет локальный адрес, обычно `http://localhost:5173`.

## Проверка качества

```bash
npm test             # запуск unit- и компонентных тестов
npm run build        # проверка TypeScript и production-сборка
npm run preview      # локальный просмотр production-сборки
npm run format:check # проверка форматирования Prettier
```

## Основные пользовательские сценарии

1. **Найти артиста:** открыть каталог → ввести имя, группу или страну → выбрать направление → открыть карточку артиста.
2. **Изучить группу и участника:** открыть каталог групп → найти коллектив → перейти на страницу группы → открыть профиль участника и изучить его информацию и дискографию.
3. **Отправить обращение:** открыть «Обратную связь» → указать email, при желании добавить имя и выбрать раздел → описать предложение → пройти клиентскую валидацию → отправить форму → увидеть подтверждение. Обращение сохраняется локально и отображается в административной панели в том же браузере.

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

## Ограничения текущего MVP

- Данные каталога и обращения демонстрационные; часть пользовательских изменений хранится только в `localStorage` текущего браузера.
- Административный вход реализован только для демонстрации клиентского интерфейса. Проверка роли в браузере не является безопасной авторизацией.
- Созданные или изменённые данные не синхронизируются между пользователями и устройствами.
- Для этапа 3 это допустимо: постоянное хранение, серверная валидация и защищённая авторизация относятся к этапу 4.

## Данные и интеграция с backend

На этапе 3 используются локальные mock-данные и `localStorage`. Каталог загружается через Redux Toolkit `createAsyncThunk`, что оставляет точку для будущей интеграции с API. Серверная запись, серверная валидация, реальная авторизация и постоянная база данных относятся к следующему этапу.

Предварительные направления API для следующего этапа: `GET /idols`, `GET /idols/:id`, `GET /groups/:id`, `GET /events/:id`, `GET /albums`, `GET /news`, `GET /search?q=...`, `POST /corrections`.

## Деплой на GitHub Pages

В проект добавлен GitHub Actions workflow `.github/workflows/deploy.yml`. После добавления `package-lock.json` workflow использует `npm ci`, запускает тесты, выполняет production-сборку Vite, добавляет SPA fallback и публикует папку `dist`.

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

## Admin content management (v44)

The admin workspace now includes separate sections for artists, groups, and news. Admins can create, edit, and delete entries, upload images, and adjust artist portrait framing with horizontal/vertical position controls. Uploaded images are resized to a maximum dimension of 1400px and compressed before saving.

**Storage limitation:** this project is still a static GitHub Pages frontend. Content changes and uploaded images are stored in the current browser's `localStorage`, so they persist in that browser but are not synchronized to other visitors or devices. For shared public publishing, authentication, and durable image hosting, connect a backend/CMS (for example Supabase or Firebase) before using the admin panel as a production content-management system. Large image uploads may still reach the browser's storage quota.

## v79 — подготовка нормализованной модели данных

Добавлен доменный слой `src/domain/catalog.ts` с отдельными сущностями и связями для артистов, групп, агентств, альбомов, треков и новостей. `src/domain/catalogStorage.ts` выполняет одноразовую, неразрушающую миграцию данных MVP v78 в нормализованный формат `idolverse-normalized-catalog-v1`. Исходные ключи localStorage не удаляются и продолжают обслуживать существующие экраны — это переходный этап, а не переключение всего интерфейса на новую модель.

Целевая схема PostgreSQL находится в `database/schema.sql`. В ней связи многие-ко-многим вынесены в отдельные таблицы (`group_memberships`, `idol_agencies`, `group_agencies`, `album_groups`, `album_credits`, `news_groups`, `news_idols`). История участия и контрактов хранится датами, а не удалением записей. Файлы изображений предполагается хранить в объектном хранилище, в БД — только URL и метаданные.

Для получения нормализованного каталога используйте `getCatalog()`. Сохранение выполняется через `saveCatalog()` / `updateCatalog()`. Функции `getAlbumsForIdol()` и `getNewsForIdol()` демонстрируют получение материалов через связи, без копирования записей в профили.

Важно: v79 — архитектурный фундамент и миграция локальных демонстрационных данных. Существующие формы админки пока остаются на прежнем формате; следующий этап — перевести формы групп/айдолов/новостей на операции над нормализованным каталогом, затем подключить API и PostgreSQL. SQL-схема является проектной заготовкой и требует применения через миграции после появления backend.


## v85 — адаптивная главная страница

Главный баннер перестроен как единая полноширинная композиция: фотография занимает весь баннер, фиолетовый градиент закреплён у левого края самого баннера, а заголовок расположен поверх него. На планшетах и телефонах фотография показывается целиком, а заголовок переносится под неё. Ограничение ширины применяется только к информационным колонкам, не к главной странице.


## v86 — планшетный breakpoint главного баннера

На ширинах до 1200px включительно используется планшетная композиция: фотография показывается целиком в пропорции 16:9 без затемняющего градиента, заголовок находится в отдельной фиолетовой панели под фото. Это предотвращает панорамное обрезание снимка и затемнение участников на промежуточных ширинах, включая 1016px. На широких desktop-экранах сохраняется полноширинный баннер с градиентом.


## v87 — fix photo alignment at tablet widths

Overrode the legacy desktop rule that kept the carousel image link at `60vw` and aligned it to the right. At widths up to 1200px the image link now fills the entire carousel, and the image is centered with `object-fit: contain`, so there is no empty half-panel or cropped group members.


## v88 — center group photos on narrow screens

On tablet and mobile widths, the group profile's photo and violet logo rail are now centered together inside the available width. The image's configured scale and aspect ratio remain unchanged; this only corrects horizontal alignment when the information section moves below the visual.


## v89 — responsive admin workspace

The admin shell, main content, and management cards now explicitly constrain themselves to the viewport on mobile and tablet widths. Artist/group/news lists use a single fluid column on mobile, while tablet widths use an adaptive grid without fixed-width overflow.


## v90 — mobile admin sign-out

The sign-out action is visible again in the compact admin sidebar and spans the full navigation width on screens up to 700px.


## v91 — profile carousels on narrow screens

Hide the floating right-side next arrow in idol/group profile carousels at viewport widths up to 1024px. The horizontal tracks remain available for touch swipe, trackpad, and horizontal scrolling.


## v92 — short edge-anchored hero blend

The desktop homepage hero uses a narrow violet fade attached to the left edge of the right-aligned photo. The old full-width overlay is disabled, so most of the image remains at its original brightness. Tablet/mobile layouts keep their stacked image-and-heading composition.


## v97 — мобильные карусели профилей

На узких экранах стрелки прокрутки каруселей в профилях скрыты; содержимое остаётся доступным через горизонтальный свайп и прокрутку. В основе этой сборки сохранена визуальная версия v95, а не экспериментальная v96.


## Проверка перед публикацией

Перед отправкой изменений в репозиторий рекомендуется выполнить из корня проекта:

```bash
npm install
npm test
npm run build
npm run format:check
```

Убедитесь, что `package-lock.json` находится в корне проекта и включён в коммит. Для последующих чистых установок и CI используйте `npm ci`.

## Актуальность документации

Описание отражает frontend MVP этапа 3. Серверная авторизация, общий для всех пользователей источник данных, API и подключение PostgreSQL относятся к следующему этапу разработки.
