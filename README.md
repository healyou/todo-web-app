# todo-web-app

Веб приложение для работы с заметками

## Настройка проекта
Development nodejs version 16.15.1
```
1) установить nodejs version 16.15.1 (использовалась при разработке)
2) Установить зависимости проекта - npm install
```

### Запуск проекта для разработки
```
1) Поменять адрес сервиса маршрутизации запросов в .env.development параметр 'VUE_APP_WEB_API_URL'
2) Запустить сервисы, необходимые для работы приложения (либо mock rest сервис, либо настроящий, поднятый на docker)
3) Запустить сервис для разработки - npm run serve (development профиль)
```

### Сборка production версии
```
npm run build (production профиль)
```

## Профили приложения
Профили:
- development (для разработки, параметры в файле .env.development, команда 'npm run serve')
- production (параметры в файле .env.production, команда 'npm run build')

## Сборка image для docker-а

### Сборка vue приложения
Dockerfile - Файл Dockerfile находится в корне проекта
Из корня проекта выполнить команду 'docker build --no-cache -t todo-web-app:latest .'

## Запуск приложения для разработки

Для работы необходимо развернуть все остальные сервисы, необходимые для работы веб приложения
(либо mock rest сервис, либо настроящий, поднятый на docker)

    npm run serve

### Запуск mock сервиса для разработки

В корне проекта файл Mock todo-api-gateway.postman_collection.json. Этот файл надо импортировать в postman и положить url mock сервиса дагнной коллеции в 
.env.development в значение параметра VUE_APP_WEB_API_URL

## Запуск приложения в docker в PROD режиме

Выполнить из корня проекта команду 'docker-compose -f "docker-compose.yml" up -d --build'

После запуска доступны следующие порты:
localhost:80 - адрес веб-приложения