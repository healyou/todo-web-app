# todo-web-app

## Project setup
Development nodejs version 16.15.1
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

# todo-app

Сервис для работы с записками

## Профили приложения

Профиль можно задать через ENV переменную 'APP_PROFILE_ACTIVE' или через аргумент командной строки 'go run main.go -APP_PROFILE_ACTIVE DEV'

Профили:
- DEV (для разработки, параметры в файле profile_dev.env)
- PROD (параметры задаются через ENV, список параметров можно увидеть в profile_dev.env, но значения будут боевые)
- TEST (для запуска тестов, параметры сейчас берутся как и в DEV из profile_dev.env)

## Сборка image для docker-а

### Сборка vue приложения
Dockerfile - Файл Dockerfile находится в корне проекта
Из корня проекта выполнить команду 'docker build --no-cache -t todo-web-app:latest .'
'docker build -t todo-web-app:latest .'

## Запуск mysql бд и minio в docker

Выполнить из корня проекта команду 'docker-compose -f "docker-compose.yml" up -d --build'
Предварительно закоментировать модуль todo-app (чтобы приложение не запукалось)

## Запуск приложения для разработки

Для работы необходимо развернуть mysql бд и minio

Из папки /src/main выполнить 'go run main.go -APP_PROFILE_ACTIVE=DEV'

Либо установить переменную окружения APP_PROFILE_ACTIVE в значение DEV и выполнить 'go run main.go'

## Запуск приложения в docker в PROD режиме

Выполнить из корня проекта команду 'docker-compose -f "docker-compose.yml" up -d --build'
Предварительно раскомментировать модуль todo-app (чтобы приложение запустилось)

После запуска доступны следующие порты:
localhost:9000 - minio хранилище файлов
localhost:3306 - mysql бд
localhost:8111 - adminer для mysql бд через nginx basic auth
localhost:9001 - miniomc для управления minio
localhost:8222 - rest service приложения

## Запуск интеграционных тестов (unit тестов нет)

Тесты работают с поднятой mysql бд, minio мокируется, транзакции откатываются.
Устанавливается профиль 'TEST' и параметры берутся из profile_dev.env

Для запуска тестов выполнить из папки /src/test выполнить команду 'go test' 
