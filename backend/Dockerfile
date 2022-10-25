FROM node:16-alpine
ENV TZ=Asia/Seoul

RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
WORKDIR /data/
COPY ./package.json /data/
COPY ./yarn.lock /data/
RUN yarn install

COPY . /data/
CMD yarn dev