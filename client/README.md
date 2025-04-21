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

## Проект запускается через dockerfile

```
docker build -t avito-front-2025 .

docker run --name avito-front-2025 -p 3000:3000 avito-front-2025

```
После запуска контейнера клиент будет доступен по адресу:
```
http://localhost:3000
```
Сервер должен быть доступен по порту 8080 для корректной работы
