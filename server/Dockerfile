FROM node:10.16.1-alpine

RUN mkdir -p /Social-Network-Profiles-Server

WORKDIR /Social-Network-Profiles-Server

COPY ./Social-Network-Profiles/server/package.json /Social-Network-Profiles-Server

RUN npm install

RUN npm install -g pm2

COPY ./Social-Network-Profiles/ /Social-Network-Profiles-Server

CMD ["pm2-runtime", "server/ecosystem.config.json", "--env", "production"]