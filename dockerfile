# Stage 1

FROM node:20.17-alpine as build-step

RUN mkdir -p /app

WORKDIR /app

COPY package.json /app

RUN npm install

COPY . /app

RUN npx ng build base-app

# Stage 2

FROM nginx:1.26.1-alpine

COPY --from=build-step /app/dist/base-app /usr/share/nginx/html
