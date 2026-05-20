import { createSlice } from '@reduxjs/toolkit';

const sesionGuardada = JSON.parse(localStorage.getItem('gamedex_sesion'));

export const userSlice = createSlice({
    name: 'user',
    initialState: sesionGuardada || {
        id_user: null,
        username: '',
        email: '',
        isLoggedIn: false
    },
    reducers: {
        setUser: (state, action) => {
            // 1. Magia pura: Revisamos si los datos vienen dentro de "usuario" (como en el Login) o sueltos
            const perfil = action.payload.usuario || action.payload;

            // 2. Ahora sí, leemos los datos de la variable desempacada
            state.id_user = perfil.id || perfil.usuario_id || perfil.id_user; 
            state.username = perfil.username || `Jugador #${state.id_user}`;
            state.email = perfil.email || '';
            state.isLoggedIn = true;

            // 3. Guardamos la sesión corregida
            localStorage.setItem('gamedex_sesion', JSON.stringify(state));
        },
        logout: (state) => {
            state.id_user = null;
            state.username = '';
            state.email = '';
            state.isLoggedIn = false;
            
            localStorage.removeItem('gamedex_sesion');
        }
    }
});

export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;