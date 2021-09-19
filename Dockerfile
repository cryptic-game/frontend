FROM node:12-alpine as builder

COPY package*.json ./

RUN npm set progress=false && npm config set depth 0 && npm cache clean --force

RUN npm i && mkdir /ng-app && cp -R ./node_modules ./ng-app

WORKDIR /ng-app

COPY . .

RUN npm run build:ci -- --output-path=./dist


FROM nginx:stable-alpine

LABEL maintainer="faq@cryptic-game.net"

EXPOSE 80

COPY nginx/nginx.conf /etc/nginx/
COPY nginx/default.conf /etc/nginx/conf.d/

RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /ng-app/dist/ /usr/share/nginx/html
RUN chown -R nginx:nginx /usr/share/nginx/html/

COPY docker-write-api-file.sh /docker-entrypoint.d/

RUN chmod +x /docker-entrypoint.d/docker-write-api-file.sh && apk add jq

CMD ["nginx", "-g", "daemon off;"]
