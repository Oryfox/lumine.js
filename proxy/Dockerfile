FROM node:22-alpine

COPY package.json .
COPY package-lock.json .
COPY index.js .

RUN npm install
EXPOSE 8080
ENTRYPOINT ["node", "index.js"]