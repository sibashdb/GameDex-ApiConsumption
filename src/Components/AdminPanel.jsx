import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setJuegos, removeJuego } from '../Store/juegosSlice';
import gamedexApi from '../api/GamedexApi';

export const AdminPanel = () => {
    const dispatch = useDispatch();
    
    // Leemos la lista desde Redux
    const { lista: juegos, yaCargados } = useSelector(state => state.juegos);
    
    // --- Estados de Autenticación ---
    const [accesoConcedido, setAccesoConcedido] = useState(false);
    const [passwordInput, setPasswordInput] = useState('');
    const [passwordGuardada, setPasswordGuardada] = useState('');
    const [errorAcceso, setErrorAcceso] = useState('');

    // --- Estados de UI ---
    const [cargando, setCargando] = useState(false);
    const [mostrandoFormulario, setMostrandoFormulario] = useState(false);

    // --- Estado del Formulario ---
    const estadoInicialFormulario = {
        titulo: '', desarrollador: '', precio: 0, clasificacion: '', imagen_url: '', generos: '', plataformas: ''
    };
    const [nuevoJuego, setNuevoJuego] = useState(estadoInicialFormulario);

    useEffect(() => {
        if (accesoConcedido && !yaCargados) {
            cargarInventario();
        }
    }, [accesoConcedido, yaCargados]);

    const cargarInventario = async () => {
        setCargando(true);
        try {
            const respuesta = await gamedexApi.get('/api/v1/juegos');
            const datosJuegos = respuesta.data.datos;
            if (datosJuegos && Array.isArray(datosJuegos)) {
                dispatch(setJuegos(datosJuegos));
            }
            setCargando(false);
        } catch (error) {
            console.error("Error al cargar inventario:", error);
            setCargando(false);
        }
    };

    // --- AQUÍ ESTÁ LA FUNCIÓN QUE FALTABA ---
    const manejarIngreso = (e) => {
        e.preventDefault();
        setErrorAcceso('');
        const passwordCorrecta = import.meta.env.VITE_ADMIN_PASSWORD;

        if (passwordInput === passwordCorrecta) {
            setPasswordGuardada(passwordInput);
            setAccesoConcedido(true);
        } else {
            setErrorAcceso('Contraseña incorrecta. Acceso denegado.');
            setPasswordInput('');
        }
    };

    const eliminarJuego = async (id) => {
        const confirmar = window.confirm(`¿Estás seguro de que quieres eliminar el juego con ID: ${id}?`);
        if (!confirmar) return;

        try {
            await gamedexApi.delete(`/api/v1/admin/juegos/${id}`, {
                headers: { 'x-token': passwordGuardada }
            });
            dispatch(removeJuego(id));
            alert("¡Juego eliminado correctamente!");
        } catch (error) {
            console.error("Error al eliminar:", error);
            alert("Hubo un error al eliminar.");
        }
    };

    const manejarCambioFormulario = (e) => {
        const { name, value } = e.target;
        setNuevoJuego({ ...nuevoJuego, [name]: name === 'precio' ? Number(value) : value });
    };

    const enviarNuevoJuego = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...nuevoJuego,
                generos: nuevoJuego.generos ? nuevoJuego.generos.split(',').map(g => g.trim()) : [],
                plataformas: nuevoJuego.plataformas ? nuevoJuego.plataformas.split(',').map(p => p.trim()) : []
            };
            
            await gamedexApi.post('/api/v1/admin/juegos', payload, {
                headers: { 'x-token': passwordGuardada }
            });

            alert("¡Juego registrado con éxito!");
            setNuevoJuego(estadoInicialFormulario);
            setMostrandoFormulario(false);
            cargarInventario(); 

        } catch (error) {
            console.error("Error al registrar:", error);
            alert(`Error al guardar: ${error.response?.data?.detail?.[0]?.msg || 'Revisa la consola'}`);
        }
    };

    // --- Pantalla de Acceso (Gate) ---
    if (!accesoConcedido) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10vh', fontFamily: 'system-ui, sans-serif' }}>
                <form onSubmit={manejarIngreso} style={{ backgroundColor: '#1a1a1a', padding: '2rem', borderRadius: '12px', border: '1px solid #333', textAlign: 'center', color: 'white', width: '300px' }}>
                    <h2 style={{ marginBottom: '1.5rem' }}>Acceso Restringido</h2>
                    <p style={{ marginBottom: '1rem', color: '#9ca3af', fontSize: '0.9rem' }}>Ingresa la clave de administrador</p>
                    <input type="password" value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)} placeholder="Contraseña..." style={{ padding: '10px', width: '100%', borderRadius: '6px', border: `1px solid ${errorAcceso ? '#ef4444' : '#555'}`, backgroundColor: '#333', color: 'white', marginBottom: '1rem', boxSizing: 'border-box' }} />
                    {errorAcceso && <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0', marginBottom: '1rem', fontWeight: 'bold' }}>{errorAcceso}</p>}
                    <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', width: '100%' }}>Entrar al Panel</button>
                </form>
            </div>
        );
    }

    if (cargando) return <p style={{ textAlign: 'center', padding: '2rem' }}>Cargando panel de control...</p>;

    return (
        <div style={{ fontFamily: 'system-ui, sans-serif', padding: '2rem 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2>{mostrandoFormulario ? 'Registrar Nuevo Título' : 'Gestión de Catálogo'}</h2>
                <button 
                    onClick={() => setMostrandoFormulario(!mostrandoFormulario)}
                    style={{ padding: '10px 20px', backgroundColor: mostrandoFormulario ? '#6b7280' : '#10b981', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
                >
                    {mostrandoFormulario ? 'Volver a la Tabla' : '+ Registrar Nuevo Juego'}
                </button>
            </div>

            {mostrandoFormulario ? (
                <form onSubmit={enviarNuevoJuego} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', maxWidth: '500px', backgroundColor: '#1a1a1a', padding: '2rem', borderRadius: '8px', color: 'white' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <label style={{ marginBottom: '5px', fontWeight: 'bold', fontSize: '0.9rem', color: '#e5e7eb' }}>Título del juego *</label>
                        <input name="titulo" value={nuevoJuego.titulo} onChange={manejarCambioFormulario} placeholder="Ej. Fortnite" required style={{ padding: '10px', borderRadius: '4px', border: '1px solid #555', backgroundColor: '#333', color: 'white' }} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <label style={{ marginBottom: '5px', fontWeight: 'bold', fontSize: '0.9rem', color: '#e5e7eb' }}>Desarrollador *</label>
                        <input name="desarrollador" value={nuevoJuego.desarrollador} onChange={manejarCambioFormulario} placeholder="Ej. Epic Games" required style={{ padding: '10px', borderRadius: '4px', border: '1px solid #555', backgroundColor: '#333', color: 'white' }} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <label style={{ marginBottom: '5px', fontWeight: 'bold', fontSize: '0.9rem', color: '#e5e7eb' }}>Precio (USD) *</label>
                        <input name="precio" type="number" value={nuevoJuego.precio} onChange={manejarCambioFormulario} required style={{ padding: '10px', borderRadius: '4px', border: '1px solid #555', backgroundColor: '#333', color: 'white' }} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <label style={{ marginBottom: '5px', fontWeight: 'bold', fontSize: '0.9rem', color: '#e5e7eb' }}>Clasificación</label>
                        <input name="clasificacion" value={nuevoJuego.clasificacion} onChange={manejarCambioFormulario} placeholder="Ej. E, T, M" style={{ padding: '10px', borderRadius: '4px', border: '1px solid #555', backgroundColor: '#333', color: 'white' }} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <label style={{ marginBottom: '5px', fontWeight: 'bold', fontSize: '0.9rem', color: '#e5e7eb' }}>URL de la portada</label>
                        <input name="imagen_url" value={nuevoJuego.imagen_url} onChange={manejarCambioFormulario} placeholder="https://..." style={{ padding: '10px', borderRadius: '4px', border: '1px solid #555', backgroundColor: '#333', color: 'white' }} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <label style={{ marginBottom: '5px', fontWeight: 'bold', fontSize: '0.9rem', color: '#e5e7eb' }}>Géneros</label>
                        <input name="generos" value={nuevoJuego.generos} onChange={manejarCambioFormulario} placeholder="Ej. Acción, Battle Royale" style={{ padding: '10px', borderRadius: '4px', border: '1px solid #555', backgroundColor: '#333', color: 'white' }} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <label style={{ marginBottom: '5px', fontWeight: 'bold', fontSize: '0.9rem', color: '#e5e7eb' }}>Plataformas</label>
                        <input name="plataformas" value={nuevoJuego.plataformas} onChange={manejarCambioFormulario} placeholder="Ej. PC, Xbox, PlayStation" style={{ padding: '10px', borderRadius: '4px', border: '1px solid #555', backgroundColor: '#333', color: 'white' }} />
                    </div>
                    <button type="submit" style={{ padding: '12px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', marginTop: '1rem' }}>
                        Guardar Juego en Base de Datos
                    </button>
                </form>
            ) : (
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#333', color: 'white' }}>
                                <th style={{ padding: '12px', borderBottom: '1px solid #555' }}>ID</th>
                                <th style={{ padding: '12px', borderBottom: '1px solid #555' }}>Título</th>
                                <th style={{ padding: '12px', borderBottom: '1px solid #555' }}>Desarrollador</th>
                                <th style={{ padding: '12px', borderBottom: '1px solid #555', textAlign: 'center' }}>Acción Individual</th>
                            </tr>
                        </thead>
                        <tbody>
                            {juegos.map((juego) => (
                                <tr key={juego.id} style={{ borderBottom: '1px solid #ccc' }}>
                                    <td style={{ padding: '12px' }}>{juego.id}</td>
                                    <td style={{ padding: '12px', fontWeight: 'bold' }}>{juego.titulo}</td>
                                    <td style={{ padding: '12px' }}>{juego.desarrollador}</td>
                                    <td style={{ padding: '12px', textAlign: 'center' }}>
                                        <button onClick={() => eliminarJuego(juego.id)} style={{ padding: '6px 12px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};