FROM node:12.18.0


WORKDIR /app

COPY package.json ./
COPY package-lock.json ./

RUN npm ci

COPY ./ ./

EXPOSE 6107

CMD ["npm","start"]
