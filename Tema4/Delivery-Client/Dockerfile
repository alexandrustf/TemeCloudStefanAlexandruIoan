FROM node:alpine AS my-app-build
WORKDIR /app

COPY package.json .
RUN npm i

COPY . .
RUN npm run build

# stage 2

FROM nginx:alpine
COPY --from=my-app-build /app/dist/hw4 /usr/share/nginx/html
EXPOSE 80
