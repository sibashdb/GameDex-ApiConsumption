import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setUser, logout } from '../Store/userSlice';
import gamedexApi from '../api/GamedexApi';

export const Navbar = () => {
    const dispatch = useDispatch();
    const { username, isLoggedIn } = useSelector(state => state.user);
    
    // Controlamos qué muestra el menú: 'botones', 'registro' o 'login'
    const [modoVista, setModoVista] = useState('botones');

    const manejarRegistro = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        
        const datosUsuario = {
            username: formData.get('username'),
            email: formData.get('email')
        };

        try {
            const respuesta = await gamedexApi.post('/api/v1/usuarios', datosUsuario);
            dispatch(setUser(respuesta.data)); 
            alert(`¡Bienvenido, ${datosUsuario.username}! Perfil creado con éxito.`);
            setModoVista('botones'); // Regresamos a la vista por defecto
        } catch (error) {
            console.error("Error al registrar usuario:", error);
            alert("No se pudo crear el usuario. Revisa los datos.");
        }
    };

    const manejarLoginManual = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const id_ingresado = Number(formData.get('id_usuario'));

        dispatch(setUser({ id: id_ingresado }));
        alert(`Sesión recuperada para el ID: ${id_ingresado}`);
        setModoVista('botones'); // Regresamos a la vista por defecto
    };

    return (
        <nav style={{ 
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '1rem 2rem', backgroundColor: '#130f22', 
            color: 'white', borderBottom: '2px solid #261f44'
        }}>
            <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                <Link to="/" style={{ color: '#a78bfa', textDecoration: 'none', fontSize: '1.5rem', fontWeight: 'bold' }}>
                    🎮 GameDex
                </Link>
                <Link to="/" style={{ color: '#cbd5e1', textDecoration: 'none' }}>Catálogo</Link>
                <Link to="/admin" style={{ color: '#f87171', textDecoration: 'none' }}>Panel Admin</Link>
            </div>

            <div>
                {isLoggedIn ? (
                    // --- VISTA CUANDO HAY SESIÓN ACTIVA ---
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <span style={{ color: '#a78bfa', fontWeight: 'bold' }}>👾 {username}</span>
                        <button 
                            onClick={() => dispatch(logout())}
                            style={{ padding: '6px 12px', backgroundColor: '#3c316a', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }}
                        >
                            Salir
                        </button>
                    </div>
                ) : (
                    // --- VISTAS PARA USUARIOS NO LOGUEADOS ---
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        
                        {/* 1. MODO BOTONES INICIALES */}
                        {modoVista === 'botones' && (
                            <>
                                <button 
                                    onClick={() => setModoVista('login')} 
                                    style={{ padding: '6px 12px', backgroundColor: '#1c1632', color: '#a78bfa', border: '1px solid #3c316a', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                                >
                                    Iniciar Sesión
                                </button>
                                <button 
                                    onClick={() => setModoVista('registro')} 
                                    style={{ padding: '6px 12px', backgroundColor: '#6366f1', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                                >
                                    Crear Usuario
                                </button>
                            </>
                        )}

                        {/* 2. MODO FORMULARIO DE REGISTRO */}
                        {modoVista === 'registro' && (
                            <form onSubmit={manejarRegistro} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                <input name="username" required placeholder="Usuario" style={{ padding: '6px', borderRadius: '4px', border: '1px solid #3c316a', backgroundColor: '#1c1632', color: 'white' }} />
                                <input name="email" type="email" required placeholder="Email" style={{ padding: '6px', borderRadius: '4px', border: '1px solid #3c316a', backgroundColor: '#1c1632', color: 'white' }} />
                                <button type="submit" style={{ padding: '6px 12px', backgroundColor: '#6366f1', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Registrar</button>
                                <button type="button" onClick={() => setModoVista('botones')} style={{ padding: '6px', backgroundColor: 'transparent', color: '#9ca3af', border: 'none', cursor: 'pointer' }}>✖</button>
                            </form>
                        )}

                        {/* 3. MODO FORMULARIO DE LOGIN (POR ID) */}
                        {modoVista === 'login' && (
                            <form onSubmit={manejarLoginManual} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                <input name="id_usuario" type="number" required placeholder="Ingresa tu ID" style={{ padding: '6px', borderRadius: '4px', border: '1px solid #3c316a', backgroundColor: '#1c1632', color: 'white' }} />
                                <button type="submit" style={{ padding: '6px 12px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Entrar</button>
                                <button type="button" onClick={() => setModoVista('botones')} style={{ padding: '6px', backgroundColor: 'transparent', color: '#9ca3af', border: 'none', cursor: 'pointer' }}>✖</button>
                            </form>
                        )}
                        
                    </div>
                )}
            </div>
        </nav>
    );
};