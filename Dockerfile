FROM node:18-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:18-alpine

RUN npm install pm2 -g

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/.output ./.output
COPY package*.json ./
COPY ecosystem.config.cjs ./

RUN npm install --omit=dev

EXPOSE 8080

CMD ["pm2-runtime", "ecosystem.config.cjs"]
