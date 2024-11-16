FROM node:23

RUN apt-get update && apt-get install -y \
    unixodbc \
    unixodbc-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /testApi

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

RUN rm -rf .env

CMD [ "npm", "start" ]