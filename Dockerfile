FROM node:10
WORKDIR /usr/src/app
COPY package.json ./
ENV NODE_ENV=staging
RUN npm install
COPY . .
EXPOSE 3000
CMD [ "node", "./bin/www" ]