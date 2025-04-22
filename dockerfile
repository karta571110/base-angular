FROM node:22.14-alpine as build-step

RUN mkdir -p /app

WORKDIR /app

COPY package.json /app

RUN npm install

COPY . /app

RUN npx ng build base-app

FROM nginx:1.27.5-alpine

COPY --from=build-step /app/dist/base-app/base/browser /usr/share/nginx/html/base

ENV NGINX_ENVSUBST_OUTPUT_DIR=/etc/nginx

ENV PORT=80

ENV SERVER_URL=http://127.0.0.1:8000

RUN mkdir -p /etc/nginx/templates

COPY /nginx.conf.template /etc/nginx/templates
