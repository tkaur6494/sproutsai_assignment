# build
FROM node:alpine as build
WORKDIR /app
COPY package.json ./
RUN npm i --silent
COPY . ./
ARG REACT_APP_API_BASE_PATH
ENV REACT_APP_API_BASE_PATH $REACT_APP_API_BASE_PATH
RUN npm run build

# Image
FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]