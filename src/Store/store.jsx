import { configureStore } from '@reduxjs/toolkit';
import juegosReducer from './juegosSlice';
import userReducer from './userSlice'; // Importamos el nuevo slice

export const store = configureStore({
    reducer: {
        juegos: juegosReducer,
        user: userReducer // Lo registramos aquí
    }
});