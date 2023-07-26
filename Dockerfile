FROM node:14
WORKDIR /usr/server
COPY ./package.json ./
COPY ./package-lock.json ./
RUN npm install
COPY . ./
CMD npm run start:dev
