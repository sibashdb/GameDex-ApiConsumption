# 🎮 GameDex - Frontend Web Application

![GameDex Banner]([INSERTA_AQUI_UNA_URL_O_RUTA_A_UNA_CAPTURA_DE_TU_APP])

GameDex es una aplicación web de página única (SPA) desarrollada en React para la gestión y exploración de un catálogo de videojuegos. El proyecto se conecta a una API REST personalizada para ofrecer operaciones CRUD, un sistema de autenticación de identidad simulada y reseñas de usuarios.

## Características Principales

* **Exploración de Catálogo:** Visualización dinámica de videojuegos con filtrado de detalles técnicos (plataformas, géneros, precios).
* **Panel de Administración Seguro:** Una ruta protegida (`/admin`) que requiere autenticación mediante variables de entorno para realizar peticiones POST y DELETE al servidor.
* **Sistema de Reseñas:** Formulario interactivo que inyecta automáticamente el ID del usuario en sesión para calificar títulos.
* **Gestión de Identidad:** Sistema de registro rápido y persistencia de sesión utilizando el LocalStorage del navegador.
* **Navegación Instantánea:** Cambio de pantallas sin tiempos de carga gracias a React Router y la memoria centralizada.

## Tecnologías Utilizadas

* **Frontend Core:** React.js + Vite
* **Gestión de Estado:** Redux Toolkit (Slices para Catálogo y Usuarios)
* **Enrutamiento:** React Router DOM
* **Peticiones HTTP:** Axios
* **Backend:** Integración con API RESTful construida en FastAPI (Desplegada en Render).

