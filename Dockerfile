FROM node:10-alpine

LABEL maintainer="Ville Nupponen <ville.nupponen@aika.in>"

WORKDIR /app

COPY package.json .
RUN npm install --silent

COPY src src

CMD ["npm", "start"]