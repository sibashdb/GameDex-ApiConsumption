# 🎮 GameDex - Frontend Web Application

[![Vercel Deploy](https://img.shields.io/badge/Desplegado_en-Vercel-black?style=for-the-badge&logo=vercel)](https://game-dex-api-consumption.vercel.app/)

> **🌐 Demo en vivo:** [https://game-dex-api-consumption.vercel.app/](https://game-dex-api-consumption.vercel.app/)



GameDex es una aplicación web de página única (SPA) desarrollada en React para la gestión y exploración de un catálogo de videojuegos. El proyecto se conecta a una API REST para ofrecer operaciones CRUD, un sistema de autenticación de identidad simulada y reseñas de usuarios, destacando por su resiliencia y manejo avanzado del estado global.

## Características Principales

* **Exploración de Catálogo:** Visualización dinámica de videojuegos con filtrado de detalles técnicos (plataformas, géneros, precios).
* **Resiliencia de Datos (Fallback):** Implementación de un sistema de respaldo que inyecta datos de demostración si la API principal experimenta caídas, garantizando una experiencia de usuario ininterrumpida.
* **Panel de Administración Seguro:** Una ruta protegida (`/admin`) que requiere autenticación mediante variables de entorno (`.env`) para realizar peticiones POST y DELETE al servidor.
* **Sistema de Reseñas:** Formulario interactivo que inyecta automáticamente el ID del usuario en sesión para calificar títulos.
* **Gestión de Identidad:** Sistema de registro rápido y persistencia de sesión utilizando el `localStorage` del navegador.
* **Navegación Instantánea:** Cambio de pantallas sin tiempos de carga gracias a React Router DOM y la memoria centralizada.

## Tecnologías Utilizadas

* **Frontend Core:** React.js + Vite
* **Gestión de Estado:** Redux Toolkit (Slices independientes para Catálogo y Usuarios)
* **Enrutamiento:** React Router DOM
* **Peticiones HTTP:** Axios
* **Backend Integrado:** API RESTful construida en FastAPI (desplegada en Render).

