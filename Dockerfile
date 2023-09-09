FROM  node:18-alpine as node
WORKDIR /app
COPY . .
RUN  npm install 
RUN npm run build --prod
FROM nginx:alpine
WORKDIR /app
COPY    nginx.conf  /etc/nginx/nginx.conf
COPY   --from=node /app/dist/gt-front /usr/share/nginx/html