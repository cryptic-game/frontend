FROM node:8-alpine as builder

MAINTAINER faq@cryptic-game.net

COPY package*.json ./

RUN npm set progress=false && npm config set depth 0 && npm cache clean --force

RUN npm i && mkdir /ng-app && cp -R ./node_modules ./ng-app

WORKDIR /ng-app

COPY . .

RUN $(npm bin)/ng build --prod --build-optimizer


FROM nginx:1.13.3-alpine

EXPOSE 80

COPY nginx/nginx.conf /etc/nginx/
COPY nginx/default.conf /etc/nginx/conf.d/

RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /ng-app/dist/frontend/ /usr/share/nginx/html
RUN chown -R nginx:nginx /usr/share/nginx/html/

CMD ["nginx", "-g", "daemon off;"]
