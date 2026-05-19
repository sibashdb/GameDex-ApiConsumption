import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setJuegos } from '../Store/juegosSlice';
import gamedexApi from '../api/GamedexApi';

export const JuegosList = () => {
    // CORRECCIÓN: Renombramos 'lista' a 'juegos' para que coincida con tu JSX abajo
    const { lista: juegos, yaCargados } = useSelector(state => state.juegos);
    const dispatch = useDispatch();
    
    const [cargando, setCargando] = useState(!yaCargados);

    useEffect(() => {
        // Solo llamamos a la API si NO hemos cargado los datos antes
        if (!yaCargados) {
            const cargarJuegos = async () => {
                try {
                    const respuesta = await gamedexApi.get('/api/v1/juegos');
                    const datosJuegos = respuesta.data.datos;
                    if (datosJuegos && Array.isArray(datosJuegos)) {
                        // Guardamos en la memoria global
                        dispatch(setJuegos(datosJuegos));
                    }
                    setCargando(false);
                } catch (error) {
                    console.error("Error al cargar:", error);
                    setCargando(false);
                }
            };
            cargarJuegos();
        }
    }, [yaCargados, dispatch]);

    if (cargando) return <p style={{ textAlign: 'center', padding: '2rem' }}>Cargando catálogo...</p>;

    return (
        <div style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
            <h2 style={{ marginBottom: '2rem' }}>Catálogo de GameDex</h2>
            
            {/* Contenedor de las tarjetas */}
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                
                {juegos.map((juego) => (
                    <div 
                        key={juego.id} 
                        style={{ 
                            border: '1px solid #333', 
                            borderRadius: '12px', 
                            padding: '1rem', 
                            width: '280px',
                            backgroundColor: '#1a1a1a', 
                            color: 'white',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
                        }}
                    >
                        {/* Imagen del juego */}
                        <img
                            src={juego.imagen_url}
                            alt={`Portada de ${juego.titulo}`}
                            style={{ 
                                width: '100%', 
                                height: '160px', 
                                objectFit: 'cover', 
                                borderRadius: '8px',
                                backgroundColor: '#2a2a2a'
                            }}
                            onError={(e) => { 
                                e.target.onerror = null; 
                                e.target.src = 'https://via.placeholder.com/280x160/2a2a2a/ffffff?text=Sin+Imagen';
                            }}
                        />
                        
                        {/* Información del juego */}
                        <h3 style={{ margin: '15px 0 5px 0', fontSize: '1.2rem' }}>{juego.titulo}</h3>
                        <p style={{ margin: '0 0 15px 0', color: '#9ca3af', fontSize: '0.9rem' }}>
                            {juego.desarrollador}
                        </p>
                        
                        {/* Etiquetas (Badges) */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                            <span style={{ 
                                padding: '4px 8px', 
                                backgroundColor: '#374151', 
                                borderRadius: '6px', 
                                fontSize: '0.8rem',
                                fontWeight: 'bold'
                            }}>
                                {juego.clasificacion}
                            </span>
                            
                            <span style={{ 
                                padding: '4px 8px', 
                                backgroundColor: juego.precio === 0 ? '#059669' : '#2563eb', 
                                borderRadius: '6px', 
                                fontSize: '0.8rem',
                                fontWeight: 'bold'
                            }}>
                                {juego.precio === 0 ? 'Free to Play' : `$${juego.precio}`}
                            </span>
                        </div>

                        {/* Botón para ver detalles */}
                        <Link to={`/juego/${juego.id}`} style={{ display: 'block', textAlign: 'center', padding: '10px', backgroundColor: '#6366f1', color: 'white', textDecoration: 'none', borderRadius: '6px', fontWeight: 'bold', transition: 'background 0.3s' }}>
                            Ver Detalles
                        </Link>
                    </div>
                ))}

                {juegos.length === 0 && (
                    <p>No hay juegos registrados en la base de datos.</p>
                )}
            </div>
        </div>
    );
};