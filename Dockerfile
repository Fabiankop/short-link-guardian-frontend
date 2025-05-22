# Etapa de construcción
FROM node:20-alpine AS build

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de configuración
COPY package.json package-lock.json ./

# Instalar dependencias
RUN npm ci

# Copiar el código fuente
COPY . .

# Configurar variables de entorno para la construcción
ENV VITE_API_URL=https://ab5d-34-238-108-151.ngrok-free.app

# Construir la aplicación
RUN npm run build

# Etapa de producción
FROM nginx:alpine AS production

# Copiar la aplicación construida
COPY --from=build /app/dist /usr/share/nginx/html

# Copiar configuración de nginx personalizada
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Modificar la configuración de Nginx para escuchar en el puerto 8080
RUN sed -i 's/listen 80;/listen 8080;/' /etc/nginx/conf.d/default.conf

# Exponer el puerto 8080 para App Runner
EXPOSE 8080

# Comando para iniciar nginx
CMD ["nginx", "-g", "daemon off;"]
