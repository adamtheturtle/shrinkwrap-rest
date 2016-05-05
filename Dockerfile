FROM node:5.2.0
MAINTAINER adamdangoor@gmail.com
WORKDIR /app
COPY ./package.json /app/package.json
RUN npm install
ADD ./ /app
ENTRYPOINT ["node", "index.js"]