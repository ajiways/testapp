FROM node:16.14.0-alpine 

COPY /src /app/src
COPY ./package.json /app/package.json
COPY ./package-lock.json /app/package-lock.json
COPY ./tsconfig.json /app/tsconfig.json

WORKDIR /app

RUN npm ci
RUN npm run build

WORKDIR /app/dist

CMD ["node", "main.js"]
