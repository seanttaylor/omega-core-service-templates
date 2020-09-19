FROM node:12-slim

COPY ./ /app

RUN apt-get update

RUN apt-get install sqlite3 -y

RUN sqlite3 ./app/data/default.db < ./app/scripts/sql/dump.sql

RUN chown node -R /app

WORKDIR /app

RUN npm ci

CMD [ "npm", "test" ]