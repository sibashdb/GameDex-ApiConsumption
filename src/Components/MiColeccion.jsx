import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import gamedexApi from '../api/GamedexApi';

export const MiColeccion = () => {
    const { id_user, username, isLoggedIn } = useSelector(state => state.user);
    const { lista: catalogoGeneral } = useSelector(state => state.juegos); 
    
    const [coleccion, setColeccion] = useState([]);
    const [cargando, setCargando] = useState(false);

    useEffect(() => {
        if (isLoggedIn && id_user) {
            const cargarColeccion = async () => {
                setCargando(true);
                try {
                    const respuesta = await gamedexApi.get(`/api/v1/usuarios/${id_user}/coleccion`);
                    
                    // Ajustado al nuevo formato de respuesta que mostró tu compañero en Swagger
                    if (respuesta.data && respuesta.data.datos) {
                        setColeccion(respuesta.data.datos);
                    }
                } catch (error) {
                    console.error("Error al cargar colección:", error);
                } finally {
                    setCargando(false);
                }
            };
            cargarColeccion();
        }
    }, [id_user, isLoggedIn]);

    if (!isLoggedIn) {
        return (
            <div style={{ textAlign: 'center', padding: '4rem 2rem', fontFamily: 'system-ui, sans-serif' }}>
                <h2 style={{ color: '#f87171', fontSize: '2rem' }}>Acceso Denegado</h2>
                <p style={{ color: '#cbd5e1', fontSize: '1.2rem' }}>Necesitas iniciar sesión para ver tu bóveda de juegos.</p>
            </div>
        );
    }

    return (
        <div style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
            <h2 style={{ marginBottom: '2rem', color: '#a78bfa', fontSize: '2rem' }}>Colección de {username}</h2>

            {cargando ? (
                <p style={{ color: '#cbd5e1' }}>Cargando tu bóveda...</p>
            ) : coleccion.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: '#130f22', borderRadius: '12px', border: '1px dashed #3c316a' }}>
                    <p style={{ color: '#cbd5e1', fontSize: '1.2rem', marginBottom: '1rem' }}>Tu colección está vacía.</p>
                    <Link to="/" style={{ padding: '10px 20px', backgroundColor: '#6366f1', color: 'white', textDecoration: 'none', borderRadius: '6px', fontWeight: 'bold' }}>Explorar Catálogo</Link>
                </div>
            ) : (
                <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                    {coleccion.map((itemRegistro, index) => {
                        // Extraemos la imagen de Redux cruzándola con el id_juego
                        const infoJuego = catalogoGeneral.find(j => j.id === itemRegistro.id_juego);
                        const imagen = infoJuego ? infoJuego.imagen_url : 'https://via.placeholder.com/280x160/2a2a2a/ffffff?text=Borrado';

                        return (
                            <div key={index} style={{ border: '1px solid #3c316a', borderRadius: '12px', padding: '1rem', width: '280px', backgroundColor: '#130f22', color: 'white', boxShadow: '0 4px 6px rgba(0,0,0,0.3)' }}>
                                <img src={imagen} alt={`Portada de ${itemRegistro.titulo}`} style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '8px', backgroundColor: '#2a2a2a' }} />
                                
                                <h3 style={{ margin: '15px 0 5px 0', fontSize: '1.2rem', color: '#f3effa' }}>{itemRegistro.titulo}</h3>
                                
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', fontSize: '0.9rem', color: '#cbd5e1' }}>
                                    <span><strong>Estado:</strong></span>
                                    <span style={{ color: '#a78bfa' }}>{itemRegistro.estado}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '5px', fontSize: '0.9rem', color: '#cbd5e1' }}>
                                    <span><strong>Horas:</strong></span>
                                    <span>{itemRegistro.horas_jugadas} hrs</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};