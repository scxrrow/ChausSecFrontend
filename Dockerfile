FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ARG VITE_GRAFANA_URL=/grafana
ARG VITE_GRAFANA_DASHBOARD_UID=chaussec-soc
RUN VITE_GRAFANA_URL=$VITE_GRAFANA_URL \
    VITE_GRAFANA_DASHBOARD_UID=$VITE_GRAFANA_DASHBOARD_UID \
    npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
