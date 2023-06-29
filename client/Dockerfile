# étape de build
FROM node:lts-alpine as build-stage

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM nginx:1.21-alpine as production-build

# Remove the default NGINX configuration
RUN rm -rf /etc/nginx/conf.d/*

# Copy the built Vue.js app from the previous stage
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Expose the NGINX port
EXPOSE 80

# Start NGINX server
CMD ["nginx", "-g", "daemon off;"]