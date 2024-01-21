FROM node:16-alpine
WORKDIR /usr/src/app/signage_app
COPY ./frontend/signage_app/package.json ./
COPY ./frontend/signage_app/package-lock.json ./
RUN yarn install
COPY ./frontend/signage_app .
