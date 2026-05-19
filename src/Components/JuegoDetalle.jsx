import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import gamedexApi from '../api/GamedexApi';

export const JuegoDetalle = () => {
    const { id } = useParams(); 
    const { lista } = useSelector(state => state.juegos);
    const { id_user, isLoggedIn } = useSelector(state => state.user); 
    
    const [juego, setJuego] = useState(null);

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
        </div>
    );
};