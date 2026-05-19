import { createSlice } from '@reduxjs/toolkit';

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        id_user: null,
        username: '',
        email: '',
        isLoggedIn: false
    },
    reducers: {
        // Guarda los datos del usuario cuando se registra o inicia sesión
        setUser: (state, action) => {
            state.id_user = action.payload.id; // Suponiendo que la API regresa "id"
            state.username = action.payload.username;
            state.email = action.payload.email;
            state.isLoggedIn = true;
        },
        // Limpia la sesión
        logout: (state) => {
            state.id_user = null;
            state.username = '';
            state.email = '';
            state.isLoggedIn = false;
        }
    }
});

export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;