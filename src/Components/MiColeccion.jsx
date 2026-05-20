import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import gamedexApi from '../api/GamedexApi';

const PLACEHOLDER = 'https://placehold.co/280x160/1c1632/a78bfa?text=Sin+Imagen';

const ESTADO_COLORES = {
    'Terminado':    { bg: '#065f46', color: '#34d399' },
    'En progreso':  { bg: '#1e3a8a', color: '#93c5fd' },
    'Pendiente':    { bg: '#44380a', color: '#fcd34d' },
};

export const MiColeccion = () => {
    const { id_user, username } = useSelector(state => state.user);
    const { lista: catalogoGeneral } = useSelector(state => state.juegos);

    const [coleccion, setColeccion] = useState([]);
    const [cargando, setCargando]   = useState(true);
    const [filtroEstado, setFiltroEstado] = useState('todos');

    useEffect(() => {
        if (!id_user) return;
        gamedexApi.get(`/api/v1/usuarios/${id_user}/coleccion`)
            .then(({ data }) => setColeccion(data.datos || []))
            .catch(() => setColeccion([]))
            .finally(() => setCargando(false));
    }, [id_user]);

    const coleccionFiltrada = filtroEstado === 'todos'
        ? coleccion
        : coleccion.filter(i => i.estado === filtroEstado);

    const totalHoras = coleccion.reduce((acc, i) => acc + (i.horas_jugadas || 0), 0);

    return (
        <div style={{ padding: '2rem 0' }}>
            {/* Header */}
            <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '4px' }}>
                    Colección de {username}
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    {coleccion.length} juego{coleccion.length !== 1 ? 's' : ''} · {totalHoras} horas totales
                </p>
            </div>

            {/* Filtros por estado */}
            {coleccion.length > 0 && (
                <div style={{ display: 'flex', gap: '8px', marginBottom: '2rem', flexWrap: 'wrap' }}>
                    {['todos', 'Terminado', 'En progreso', 'Pendiente'].map(estado => (
                        <button
                            key={estado}
                            onClick={() => setFiltroEstado(estado)}
                            className={`gd-btn ${filtroEstado === estado ? 'gd-btn-primary' : 'gd-btn-ghost'}`}
                            style={{ padding: '7px 14px', fontSize: '0.85rem' }}
                        >
                            {estado === 'todos' ? 'Todos' : estado}
                            {estado !== 'todos' && (
                                <span style={{ marginLeft: '6px', opacity: 0.7 }}>
                                    ({coleccion.filter(i => i.estado === estado).length})
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            )}

            {/* Contenido */}
            {cargando ? (
                <div className="catalogo-grid">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="gd-card" style={{ padding: '1rem' }}>
                            <div className="skeleton" style={{ height: '160px', borderRadius: '8px', marginBottom: '1rem' }} />
                            <div className="skeleton" style={{ height: '18px', width: '70%', marginBottom: '8px' }} />
                            <div className="skeleton" style={{ height: '14px', width: '50%' }} />
                        </div>
                    ))}
                </div>
            ) : coleccion.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem 2rem', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--border-muted)' }}>
                    <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>📂</p>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '1.5rem' }}>Tu colección está vacía.</p>
                    <Link to="/" className="gd-btn gd-btn-primary">Explorar catálogo</Link>
                </div>
            ) : coleccionFiltrada.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    <p>No hay juegos con estado "{filtroEstado}".</p>
                </div>
            ) : (
                <div className="catalogo-grid">
                    {coleccionFiltrada.map((item, i) => {
                        const infoJuego = catalogoGeneral.find(j => j.id === item.id_juego);
                        const imagen = infoJuego?.imagen_url || PLACEHOLDER;
                        const colores = ESTADO_COLORES[item.estado] || { bg: '#374151', color: '#cbd5e1' };

                        return (
                            <div key={i} className="gd-card" style={{ padding: '1rem', display: 'flex', flexDirection: 'column' }}>
                                <img
                                    src={imagen}
                                    alt={item.titulo}
                                    onError={e => { e.target.onerror = null; e.target.src = PLACEHOLDER; }}
                                    style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '8px', backgroundColor: 'var(--bg-elevated)' }}
                                    loading="lazy"
                                />
                                <h3 style={{ margin: '14px 0 8px 0', fontSize: '1rem', color: 'var(--text-primary)' }}>
                                    {item.titulo}
                                </h3>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '10px' }}>
                                    <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 700, backgroundColor: colores.bg, color: colores.color }}>
                                        {item.estado}
                                    </span>
                                    <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                        {item.horas_jugadas} hrs
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
