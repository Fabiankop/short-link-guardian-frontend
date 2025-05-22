# Spot2 - URL Shortener

Este proyecto es un acortador de enlaces seguro y fácil de usar, desarrollado con React, Vite y Tailwind CSS.

## Características principales
- Acortamiento de URLs de forma segura
- Interfaz moderna y responsiva

---

## Requisitos previos
- Node.js >= 18
- npm >= 9

---

## Configuración de Variables de Entorno

El proyecto utiliza variables de entorno para su configuración. Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```
# URL base de la API
VITE_API_URL=http://localhost:8000

# Tiempo de expiración del token en milisegundos (24 horas por defecto)
VITE_TOKEN_EXPIRATION=86400000

# Nombre de la aplicación
VITE_APP_NAME=Spot2

# Timeout para peticiones API en milisegundos
VITE_API_TIMEOUT=10000
```

También puedes copiar el archivo `.env.example` y personalizarlo según tus necesidades.

---

## Instalación

```bash
npm install
```

---

## Levantar el proyecto en desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:8080` (o el puerto que indique Vite).

---

## Estructura del proyecto

```
├── src/
│   ├── components/      # Componentes reutilizables
│   ├── pages/           # Vistas principales
│   ├── services/        # Lógica de negocio y API
│   ├── hooks/           # Custom hooks
│   ├── App.tsx          # Componente raíz
│   ├── App.css          # Estilos personalizados
│   ├── index.css        # Estilos globales y Tailwind
│   └── main.tsx         # Entry point
├── public/
├── tailwind.config.ts   # Configuración de Tailwind (Montserrat como fuente principal)
├── vite.config.ts       # Configuración de Vite
└── README.md            # Este archivo
```

---

## Buenas prácticas
- Usa nombres descriptivos y tipado fuerte.
- Mantén la lógica desacoplada y reutilizable.
- Aplica el principio de responsabilidad única en componentes y funciones.

---

## Licencia
[MIT](LICENSE)
