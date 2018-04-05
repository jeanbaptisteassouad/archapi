FROM node:9.7.1 as dev

RUN apt-get update && apt-get -y install \
  inotify-tools=3.14-1+b1 \
  rsync=3.1.1-3+deb8u1

WORKDIR /usr/src/app

COPY package*.json ./
# Remove comment in json
RUN sed -i -e '/\/\//d' package.json

RUN yarn install

Run ./node_modules/.bin/nsp check

RUN export NODE_ENV=development

COPY . .
# Remove comment in json
RUN sed -i -e '/\/\//d' package.json


# RUN npm run-script bsb


CMD ["npm", "run-script", "node", "--", "--use_strict", "./src/app.js"]
