import { createSlice } from '@reduxjs/toolkit';

export const juegosSlice = createSlice({
    name: 'juegos',
    initialState: {
        lista: [],
        yaCargados: false 
    },
    reducers: {
        // Guarda la lista completa que viene de la API
        setJuegos: (state, action) => {
            state.lista = action.payload;
            state.yaCargados = true;
        },
        // Añade un nuevo juego al arreglo global de forma inmediata
        addJuego: (state, action) => {
            state.lista.push(action.payload);
        },
        // Remueve un juego del arreglo global filtrando por su ID
        removeJuego: (state, action) => {
            state.lista = state.lista.filter(juego => juego.id !== action.payload);
        }
    }
});

// Exportamos las acciones para poder usarlas en los componentes con dispatch()
export const { setJuegos, addJuego, removeJuego } = juegosSlice.actions;
export default juegosSlice.reducer;