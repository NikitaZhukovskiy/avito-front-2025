# Этап сборки
FROM node:20-alpine AS builder

WORKDIR /app
COPY . .

RUN npm install
RUN npm run build

# Этап запуска
FROM node:20-alpine

WORKDIR /app
RUN npm install -g serve
COPY --from=builder /app/dist ./dist

EXPOSE 3000

# Запускаем сервер на порту 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
