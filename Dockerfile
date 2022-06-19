FROM node:16 as build-stage

RUN npm install -g http-server

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY .env.production ./
COPY /public ./public
COPY /src ./src
COPY babel.config.js ./
COPY jsconfig.json ./
COPY README.md ./
COPY vue.config.js ./

RUN npm run build

FROM nginx:1.22-alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]