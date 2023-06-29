# étape de build
FROM node:lts-alpine as build-stage

WORKDIR /app

COPY package*.json ./

RUN npm install -g pm2

RUN npm install

ENV NODE_ENV=production

ENV JWT_SECRET=$JWT_SECRET

ENV DATABASE_URL=$DATABASE_URL

COPY . .

EXPOSE 3000

CMD ["pm2-runtime", "start", "index.js"]
