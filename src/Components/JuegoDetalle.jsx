import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import gamedexApi from '../api/GamedexApi';

export const JuegoDetalle = () => {
    const { id } = useParams(); 
    const { lista } = useSelector(state => state.juegos);
    const { id_user, isLoggedIn } = useSelector(state => state.user); 
    
    const [juego, setJuego] = useState(null);

    const [resenas, setResenas] = useState([]);
    const [cargandoResenas, setCargandoResenas] = useState(true);

    // Efecto para descargar las reseñas cuando se abre el juego
    useEffect(() => {
        const cargarResenas = async () => {
            try {
                const respuesta = await gamedexApi.get(`/api/v1/juegos/${id}/resenas`);
                
                // Tu captura muestra que respuesta.data es directamente el arreglo
                if (Array.isArray(respuesta.data)) {
                    setResenas(respuesta.data);
                }
            } catch (error) {
                console.error("Error al cargar reseñas:", error);
                setResenas([]); 
            } finally {
                setCargandoResenas(false);
            }
        };
        
        cargarResenas();
    }, [id]);
    
    useEffect(() => {
        const juegoEncontrado = lista.find(j => j.id === Number(id));
        setJuego(juegoEncontrado);
    }, [id, lista]);
    
    if (!juego) return (
        <div style={{ textAlign: 'center', padding: '2rem', color: 'white', fontFamily: 'system-ui, sans-serif' }}>
            <h2>Juego no encontrado</h2>
            <p>Por favor, regresa al catálogo principal para sincronizar los datos.</p>
            <Link to="/" style={{ color: '#3b82f6' }}>Volver al catálogo</Link>
        </div>
    );

    return (
        <div style={{ fontFamily: 'system-ui, sans-serif', maxWidth: '800px', margin: '0 auto', padding: '2rem 0' }}>
            <Link to="/" style={{ color: '#9ca3af', textDecoration: 'none', marginBottom: '1rem', display: 'inline-block' }}>
                ← Volver al catálogo
            </Link>
            
            <div style={{ display: 'flex', gap: '2rem', backgroundColor: '#1a1a1a', padding: '2rem', borderRadius: '12px', color: 'white' }}>
                <img 
                    src={juego.imagen_url} 
                    alt={`Portada de ${juego.titulo}`}
                    style={{ width: '300px', height: 'auto', borderRadius: '8px', objectFit: 'cover', backgroundColor: '#2a2a2a' }}
                    onError={(e) => { 
                        e.target.onerror = null; 
                        e.target.src = 'https://via.placeholder.com/300x400/2a2a2a/ffffff?text=Sin+Imagen';
                    }}
                />
                
                <div>
                    <h1 style={{ margin: '0 0 10px 0', fontSize: '2.5rem' }}>{juego.titulo}</h1>
                    <p style={{ color: '#9ca3af', fontSize: '1.2rem', margin: '0 0 20px 0' }}>Desarrollador: {juego.desarrollador}</p>
                    
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '20px' }}>
                        <span style={{ padding: '6px 12px', backgroundColor: '#374151', borderRadius: '6px', fontWeight: 'bold' }}>{juego.clasificacion}</span>
                        <span style={{ padding: '6px 12px', backgroundColor: '#059669', borderRadius: '6px', fontWeight: 'bold' }}>{juego.precio === 0 ? 'Gratis' : `$${juego.precio}`}</span>
                    </div>

                    <h3 style={{ margin: '0 0 10px 0' }}>Géneros</h3>
                    <p style={{ color: '#d1d5db', marginBottom: '20px' }}>
                        {Array.isArray(juego.generos) ? juego.generos.join(' • ') : juego.generos}
                    </p>

                    <h3 style={{ margin: '0 0 10px 0' }}>Plataformas</h3>
                    <p style={{ color: '#d1d5db' }}>
                        {Array.isArray(juego.plataformas) ? juego.plataformas.join(' • ') : juego.plataformas}
                    </p>
                </div>
            </div>

            {/* --- SECCIÓN: AGREGAR A MI COLECCIÓN (SIN FECHA) --- */}
            <div style={{ marginTop: '2rem', padding: '2rem', backgroundColor: '#1c1632', border: '1px solid #3c316a', borderRadius: '12px' }}>
                <h2 style={{ color: '#6366f1', marginTop: '0', marginBottom: '1rem' }}>Mi Bóveda Personal</h2>
                
                {!isLoggedIn ? (
                    <p style={{ color: '#f87171', fontWeight: 'bold', margin: 0 }}>✗ Inicia sesión para guardar este juego en tu colección.</p>
                ) : (
                    <form onSubmit={async (e) => {
                        e.preventDefault();
                        const formData = new FormData(e.target);
                        
                        const payloadColeccion = {
                            id_juego: Number(id), // Se envía como número entero (0 en el ejemplo)
                            estado: formData.get('estado'), // Se envía como texto ("string")
                            horas_jugadas: Number(formData.get('horas_jugadas')) // Se envía como número entero
                        };

                        try {
                            await gamedexApi.post(`/api/v1/usuarios/${id_user}/coleccion`, payloadColeccion);
                            alert("¡Agregado a tu colección con éxito!");
                            e.target.reset();                      
                        } catch (error) {
                            console.error("Error al guardar en colección:", error);
                            
                            // Capturamos la respuesta del backend de tu compañero
                            const mensajeApi = error.response?.data?.detail;
                            
                            // Revisamos si el mensaje es un texto directo o una lista de Pydantic
                            const textoError = typeof mensajeApi === 'string' 
                                ? mensajeApi 
                                : mensajeApi?.[0]?.msg;

                            alert(`Error del servidor: ${textoError || 'Rechazado (Revisa la consola)'}`);
                        }
                    }} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', flex: '1', minWidth: '150px' }}>
                            <label style={{ marginBottom: '5px', fontSize: '0.9rem', color: '#cbd5e1' }}>Estado</label>
                            <select name="estado" style={{ padding: '10px', borderRadius: '6px', border: '1px solid #3c316a', backgroundColor: '#130f22', color: 'white' }}>
                                <option value="En progreso">En progreso</option>
                                <option value="Pendiente">Pendiente</option>
                                <option value="Terminado">Terminado</option>
                            </select>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', width: '120px' }}>
                            <label style={{ marginBottom: '5px', fontSize: '0.9rem', color: '#cbd5e1' }}>Horas</label>
                            <input name="horas_jugadas" type="number" min="0" defaultValue="0" required style={{ padding: '10px', borderRadius: '6px', border: '1px solid #3c316a', backgroundColor: '#130f22', color: 'white' }} />
                        </div>

                        <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', height: '41px' }}>
                            + Guardar
                        </button>
                    </form>
                )}
            </div>

            {/* SECCIÓN DE RESEÑAS (Intacta y funcional) */}
            <div style={{ marginTop: '2rem', padding: '2rem', backgroundColor: '#130f22', border: '1px solid #261f44', borderRadius: '12px' }}>
                <h2 style={{ color: '#a78bfa', marginTop: '0', marginBottom: '1.5rem' }}>Dejar una Reseña</h2>
                
                <form onSubmit={async (e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target);
                    
                    const nuevaResena = {
                        id_usuario: id_user, 
                        puntuacion: Number(formData.get('puntuacion')),
                        comentario: formData.get('comentario')
                    };

                    try {
                        await gamedexApi.post(`/api/v1/juegos/${id}/resenas`, nuevaResena);
                        alert("¡Tu reseña ha sido publicada con éxito!");
                        e.target.reset();
                    } catch (error) {
                        console.error("Error al publicar reseña:", error);
                        alert(`Error: ${error.response?.data?.detail?.[0]?.msg || 'Hubo un problema al procesar la reseña'}`);
                    }
                }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <p style={{ margin: 0, color: isLoggedIn ? '#34d399' : '#f87171', fontWeight: 'bold' }}>
                                {isLoggedIn ? `✓ Publicando como usuario ID: ${id_user}` : '✗ Necesitas crear un perfil arriba para poder reseñar'}
                            </p>
                        </div>
                        
                        <div style={{ width: '150px', display: 'flex', flexDirection: 'column' }}>
                            <label style={{ marginBottom: '5px', fontSize: '0.9rem', color: '#cbd5e1' }}>Puntuación</label>
                            <select name="puntuacion" disabled={!isLoggedIn} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #3c316a', backgroundColor: '#1c1632', color: 'white', height: '41px' }}>
                                <option value="5">⭐⭐⭐⭐⭐ (5)</option>
                                <option value="4">⭐⭐⭐⭐ (4)</option>
                                <option value="3">⭐⭐⭐ (3)</option>
                                <option value="2">⭐⭐ (2)</option>
                                <option value="1">⭐ (1)</option>
                            </select>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <label style={{ marginBottom: '5px', fontSize: '0.9rem', color: '#cbd5e1' }}>Tu Opinión</label>
                        <textarea name="comentario" required disabled={!isLoggedIn} rows="4" placeholder={isLoggedIn ? "¿Qué te pareció este juego?" : "Crea tu perfil en el menú superior para escribir un comentario..."} style={{ padding: '10px', borderRadius: '6px', border: '1px solid #3c316a', backgroundColor: '#1c1632', color: 'white', resize: 'vertical' }}></textarea>
                    </div>

                    <button type="submit" disabled={!isLoggedIn} style={{ padding: '12px', backgroundColor: isLoggedIn ? '#a78bfa' : '#4b5563', color: '#0b0813', border: 'none', borderRadius: '6px', cursor: isLoggedIn ? 'pointer' : 'not-allowed', fontWeight: 'bold', fontSize: '1rem', marginTop: '0.5rem' }}>
                        Publicar Comentario
                    </button>
                </form>
            </div>
            {/* --- SECCIÓN: LISTA DE RESEÑAS DE LA COMUNIDAD --- */}
            <div style={{ marginTop: '2rem', padding: '2rem', backgroundColor: '#130f22', border: '1px solid #261f44', borderRadius: '12px' }}>
                <h2 style={{ color: '#a78bfa', marginTop: '0', marginBottom: '1.5rem' }}>Opiniones de la Comunidad</h2>
                
                {cargandoResenas ? (
                    <p style={{ color: '#cbd5e1' }}>Cargando pergaminos de sabiduría...</p>
                ) : resenas.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2rem', backgroundColor: '#1c1632', borderRadius: '8px', border: '1px dashed #3c316a' }}>
                        <p style={{ color: '#9ca3af', fontStyle: 'italic', margin: 0 }}>Aún no hay reseñas. ¡Sé el primero en dar tu opinión!</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {resenas.map((resena, index) => (
                            <div key={index} style={{ backgroundColor: '#1c1632', padding: '1.5rem', borderRadius: '8px', border: '1px solid #3c316a', boxShadow: '0 4px 6px rgba(0,0,0,0.2)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', alignItems: 'center' }}>
                                    <strong style={{ color: '#6366f1', fontSize: '1.1rem' }}>
                                        {/* Mostramos el username, o el ID si la API no devuelve el nombre */}
                                        👾 {resena.username || `Usuario #${resena.id_usuario}`}
                                    </strong>
                                    <span style={{ color: '#fbbf24', letterSpacing: '2px', fontSize: '1.1rem' }}>
                                        {/* Magia para dibujar las estrellas según la puntuación */}
                                        {'★'.repeat(resena.puntuacion)}{'☆'.repeat(5 - resena.puntuacion)}
                                    </span>
                                </div>
                                <p style={{ color: '#e2e8f0', margin: 0, lineHeight: '1.6' }}>"{resena.comentario}"</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            
        </div>
    );
};