FROM node:12-alpine

COPY ./ /app

RUN chown node -R /app

WORKDIR /app

RUN npm ci --only=production

EXPOSE 8080

CMD [ "npm", "start" ]