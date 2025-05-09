# Использованные технологии

<ul>
  <li>Node.js v20</li>
  <li>React v18+</li>
  <li>react-router-dom для роутинга</li>
  <li>TailwindCSS - framework для работы с CSS стилями. Выбрал именно этот фреймворк, поскольку уже был опыт работы с ним.</li>
  <li>Линтер (ESLint)</li>
  <li>Система сборки Vite</li>
  <li>React Query</li>
</ul>

## Проект запускается через docker-compose

Для запуска проекта введите в консоль:

```
docker-compose up --build

```

После запуска контейнера клиент будет доступен по адресу:

```
http://localhost:3000
```

А server по адресу:

```
http://localhost:8080
```

# Краткое описание элементов проекта:

<ul>
  <li>\components\Header.tsx - шапка (header) для сайта. Он отображается на каждой странице</li>
  <li>\components\TaskForm.tsx - форма для создания/редактирования задач. Имеет 2 мода ("create" и "edit"), в зависимости от режима, отображает данные о задаче. При режиме "create" после отправки формы создается новая задача. При режиме "edit" отправляется запрос на обновление задачи по taskId</li>
  <li>\hooks\useAssignee.ts- хук для проброса данных об пользователях </li>
  <li>\hooks\useBoards.ts - хук для проброса данных о всех проектах</li>
  <li>\pages\AllIssuesPage.tsx - страница со всеми задачами. У каждой задачи есть кнопка для перехода на проект (доску), на которой используется эта задача</li>
  <li>\pages\BoardPage.tsx - страница проекта. Имеет функцию drag-and-drop для изменения статусов задач</li>
  <li>\pages\BoardsListPage.tsx - страница со всеми проектами (досками). У каждого проекта отображается его название, описание и количество задач, которые он содержит</li>
  <li>\types\assignee.ts - тип для исполнителя</li>
  <li>\types\board.ts - тип для проекта (доски)</li>
  <li>\types\Task.ts - тип для задачи</li>
  <li>src\App.tsx - роутинг</li>
</ul>
