import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import gamedexApi from '../api/GamedexApi';
import { useToast } from '../hooks/useToast';

const PLACEHOLDER = 'https://placehold.co/300x420/1c1632/a78bfa?text=Sin+Imagen';

const Stars = ({ puntuacion }) => (
    <span style={{ color: 'var(--accent-amber)', letterSpacing: '2px', fontSize: '1.1rem' }}>
        {'★'.repeat(puntuacion)}{'☆'.repeat(5 - puntuacion)}
    </span>
);

export const JuegoDetalle = () => {
    const { id } = useParams();
    const { lista } = useSelector(state => state.juegos);
    const { id_user, isLoggedIn } = useSelector(state => state.user);
    const toast = useToast();

    const [juego, setJuego]   = useState(null);
    const [cargando, setCargando] = useState(true);
    const [resenas, setResenas]   = useState([]);
    const [cargandoResenas, setCargandoResenas] = useState(true);
    const [enviandoColeccion, setEnviandoColeccion] = useState(false);
    const [enviandoResena, setEnviandoResena]       = useState(false);

    // 1. Buscar el juego: primero en Redux, luego en la API
    useEffect(() => {
        const enStore = lista.find(j => j.id === Number(id));
        if (enStore) {
            setJuego(enStore);
            setCargando(false);
        } else {
            gamedexApi.get(`/api/v1/juegos/${id}`)
                .then(({ data }) => setJuego(data.datos || data))
                .catch(() => setJuego(null))
                .finally(() => setCargando(false));
        }
    }, [id, lista]);

    // 2. Cargar reseñas
    useEffect(() => {
        gamedexApi.get(`/api/v1/juegos/${id}/resenas`)
            .then(({ data }) => setResenas(Array.isArray(data) ? data : []))
            .catch(() => setResenas([]))
            .finally(() => setCargandoResenas(false));
    }, [id]);

    const guardarEnColeccion = async (e) => {
        e.preventDefault();
        setEnviandoColeccion(true);
        const fd = new FormData(e.target);
        try {
            await gamedexApi.post(`/api/v1/usuarios/${id_user}/coleccion`, {
                id_juego:      Number(id),
                estado:        fd.get('estado'),
                horas_jugadas: Number(fd.get('horas_jugadas')),
            });
            toast.success('¡Juego guardado en tu colección!');
            e.target.reset();
        } catch (err) {
            const msg = err.response?.data?.detail;
            const texto = typeof msg === 'string' ? msg : msg?.[0]?.msg;
            toast.error(texto || 'No se pudo guardar. Intenta de nuevo.');
        } finally {
            setEnviandoColeccion(false);
        }
    };

    const publicarResena = async (e) => {
        e.preventDefault();
        setEnviandoResena(true);
        const fd = new FormData(e.target);
        const nuevaResena = {
            id_usuario: id_user,
            puntuacion: Number(fd.get('puntuacion')),
            comentario: fd.get('comentario'),
        };
        try {
            await gamedexApi.post(`/api/v1/juegos/${id}/resenas`, nuevaResena);
            toast.success('¡Tu reseña fue publicada!');
            setResenas(prev => [{ ...nuevaResena, username: null }, ...prev]);
            e.target.reset();
        } catch (err) {
            const msg = err.response?.data?.detail;
            toast.error(typeof msg === 'string' ? msg : msg?.[0]?.msg || 'Error al publicar.');
        } finally {
            setEnviandoResena(false);
        }
    };

    if (cargando) return (
        <div style={{ padding: '2rem 0' }}>
            <div style={{ display: 'flex', gap: '2rem', backgroundColor: 'var(--bg-card)', padding: '2rem', borderRadius: 'var(--radius-lg)' }}>
                <div className="skeleton" style={{ width: '260px', height: '360px', borderRadius: '8px', flexShrink: 0 }} />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div className="skeleton" style={{ height: '42px', width: '70%' }} />
                    <div className="skeleton" style={{ height: '18px', width: '40%' }} />
                    <div className="skeleton" style={{ height: '18px', width: '55%' }} />
                </div>
            </div>
        </div>
    );

    if (!juego) return (
        <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</p>
            <h2 style={{ color: 'var(--accent-red)', marginBottom: '1rem' }}>Juego no encontrado</h2>
            <Link to="/" className="gd-btn gd-btn-primary">Volver al catálogo</Link>
        </div>
    );

    const generosArr    = Array.isArray(juego.generos)    ? juego.generos    : juego.generos?.split(',').map(g => g.trim())    || [];
    const plataformasArr = Array.isArray(juego.plataformas) ? juego.plataformas : juego.plataformas?.split(',').map(p => p.trim()) || [];

    return (
        <div style={{ maxWidth: '860px', margin: '0 auto', padding: '2rem 0' }}>
            <Link to="/" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '1.5rem' }}>
                ← Volver al catálogo
            </Link>

            {/* Ficha del juego */}
            <div className="gd-card" style={{ padding: '2rem', display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                <img
                    src={juego.imagen_url || PLACEHOLDER}
                    alt={`Portada de ${juego.titulo}`}
                    onError={e => { e.target.onerror = null; e.target.src = PLACEHOLDER; }}
                    style={{ width: '220px', height: '300px', objectFit: 'cover', borderRadius: '10px', flexShrink: 0 }}
                />
                <div style={{ flex: 1, minWidth: '200px' }}>
                    <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '6px' }}>{juego.titulo}</h1>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>por {juego.desarrollador}</p>

                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
                        <span className="gd-badge gd-badge-dark">{juego.clasificacion || '—'}</span>
                        <span className={`gd-badge ${juego.precio === 0 ? 'gd-badge-green' : 'gd-badge-blue'}`}>
                            {juego.precio === 0 ? 'Free to Play' : `$${juego.precio} MXN`}
                        </span>
                    </div>

                    {generosArr.length > 0 && (
                        <div style={{ marginBottom: '16px' }}>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Géneros</p>
                            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                {generosArr.map(g => <span key={g} className="gd-badge gd-badge-violet">{g}</span>)}
                            </div>
                        </div>
                    )}

                    {plataformasArr.length > 0 && (
                        <div>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Plataformas</p>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{plataformasArr.join(' · ')}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Mi Colección */}
            <div className="gd-card" style={{ padding: '1.75rem', marginTop: '1.5rem', borderColor: 'var(--border-muted)' }}>
                <h2 style={{ color: 'var(--accent-indigo)', marginBottom: '1.25rem', fontSize: '1.2rem' }}>📁 Mi Bóveda Personal</h2>
                {!isLoggedIn ? (
                    <p style={{ color: 'var(--accent-red)' }}>
                        <Link to="/login" style={{ color: 'var(--accent-violet)' }}>Inicia sesión</Link> para guardar este juego en tu colección.
                    </p>
                ) : (
                    <form onSubmit={guardarEnColeccion} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                        <div className="form-field" style={{ flex: 1, minWidth: '140px' }}>
                            <label className="gd-label">Estado</label>
                            <select name="estado" className="gd-input">
                                <option value="En progreso">En progreso</option>
                                <option value="Pendiente">Pendiente</option>
                                <option value="Terminado">Terminado</option>
                            </select>
                        </div>
                        <div className="form-field" style={{ width: '110px' }}>
                            <label className="gd-label">Horas</label>
                            <input name="horas_jugadas" type="number" min="0" defaultValue="0" required className="gd-input" />
                        </div>
                        <button type="submit" className="gd-btn gd-btn-success" disabled={enviandoColeccion} style={{ height: '41px' }}>
                            {enviandoColeccion ? 'Guardando...' : '+ Guardar'}
                        </button>
                    </form>
                )}
            </div>

            {/* Dejar reseña */}
            <div className="gd-card" style={{ padding: '1.75rem', marginTop: '1.5rem' }}>
                <h2 style={{ color: 'var(--accent-violet)', marginBottom: '1.25rem', fontSize: '1.2rem' }}>✍ Dejar una Reseña</h2>

                {!isLoggedIn && (
                    <p style={{ color: 'var(--text-muted)', marginBottom: '1rem', fontSize: '0.9rem' }}>
                        <Link to="/login" style={{ color: 'var(--accent-violet)' }}>Inicia sesión</Link> para escribir una reseña.
                    </p>
                )}

                <form onSubmit={publicarResena} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div className="form-field" style={{ width: '180px' }}>
                        <label className="gd-label">Puntuación</label>
                        <select name="puntuacion" disabled={!isLoggedIn} className="gd-input">
                            {[5,4,3,2,1].map(n => (
                                <option key={n} value={n}>{'⭐'.repeat(n)} ({n})</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-field">
                        <label className="gd-label">Tu opinión</label>
                        <textarea
                            name="comentario" required disabled={!isLoggedIn} rows="4"
                            placeholder={isLoggedIn ? '¿Qué te pareció este juego?' : 'Inicia sesión para escribir...'}
                            className="gd-input" style={{ resize: 'vertical' }}
                        />
                    </div>
                    <button
                        type="submit"
                        className="gd-btn gd-btn-primary"
                        disabled={!isLoggedIn || enviandoResena}
                        style={{ alignSelf: 'flex-start' }}
                    >
                        {enviandoResena ? 'Publicando...' : 'Publicar reseña'}
                    </button>
                </form>
            </div>

            {/* Reseñas de la comunidad */}
            <div className="gd-card" style={{ padding: '1.75rem', marginTop: '1.5rem' }}>
                <h2 style={{ color: 'var(--accent-violet)', marginBottom: '1.5rem', fontSize: '1.2rem' }}>
                    💬 Opiniones de la Comunidad
                    {resenas.length > 0 && (
                        <span style={{ marginLeft: '10px', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 400 }}>
                            ({resenas.length})
                        </span>
                    )}
                </h2>

                {cargandoResenas ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {[1,2,3].map(i => <div key={i} className="skeleton" style={{ height: '80px', borderRadius: '8px' }} />)}
                    </div>
                ) : resenas.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2rem', border: '1px dashed var(--border-muted)', borderRadius: 'var(--radius-md)', color: 'var(--text-muted)' }}>
                        Aún no hay reseñas. ¡Sé el primero!
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {resenas.map((r, i) => (
                            <div key={i} style={{ backgroundColor: 'var(--bg-elevated)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                    <strong style={{ color: 'var(--accent-indigo)', fontSize: '0.95rem' }}>
                                        👾 {r.username || `Usuario #${r.id_usuario}`}
                                    </strong>
                                    <Stars puntuacion={r.puntuacion} />
                                </div>
                                <p style={{ color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6, fontSize: '0.92rem' }}>
                                    "{r.comentario}"
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
