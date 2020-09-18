FROM node:alpine

WORKDIR /usr/src/app

RUN apk add yarn

COPY package.json ./

RUN yarn install --frozen-lockfile

COPY ./ ./

EXPOSE 9595

CMD ["yarn", "start"]