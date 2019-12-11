FROM node:10.16.1-alpine as builder

RUN mkdir -p /Social-Network-Profiles-Client

WORKDIR /Social-Network-Profiles-Client

ENV PATH /node_modules/.bin:$PATH

COPY ./client/package.json /Social-Network-Profiles-Client

RUN  npm install

RUN npm install react-scripts -g --silent

COPY . /Social-Network-Profiles-Client

RUN npm run build --prefix client


FROM nginx:1.17.2

COPY ./client/nginx.conf /etc/nginx/nginx.conf

RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /Social-Network-Profiles-Client/client/build /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]
