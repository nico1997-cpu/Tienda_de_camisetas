# ==============================================================
# 📦 BACKEND (Spring Boot)
# ==============================================================
# Etapa de compilación del backend
FROM maven:3.9-eclipse-temurin-21 AS backend-build
WORKDIR /app
COPY pom.xml ./
RUN mvn dependency:go-offline -B
COPY src/main ./src/main
RUN mvn clean package -DskipTests

# Imagen final del backend
FROM eclipse-temurin:21-jre-alpine AS backend
WORKDIR /app
COPY --from=backend-build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]


# ==============================================================
# 🎨 FRONTEND (Angular + Nginx)
# ==============================================================
# Etapa de compilación del frontend
FROM node:20-alpine AS frontend-build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY angular.json tsconfig*.json ./
COPY public/ ./public/
COPY src/ ./src/
RUN npm run build -- --configuration production

# Imagen final del frontend
FROM nginx:alpine AS frontend
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=frontend-build /app/dist/tienda-camisetas-frontend/browser /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
