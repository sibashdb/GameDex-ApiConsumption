import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { setJuegos } from '../Store/juegosSlice';
import gamedexApi from '../api/GamedexApi';
import { SkeletonCard } from './SkeletonCard';

const PLACEHOLDER = 'https://placehold.co/280x160/1c1632/a78bfa?text=Sin+Imagen';

const GameCard = ({ juego }) => (
    <div className="gd-card" style={{ padding: '1rem', display: 'flex', flexDirection: 'column' }}>
        <img
            src={juego.imagen_url || PLACEHOLDER}
            alt={`Portada de ${juego.titulo}`}
            style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '8px', backgroundColor: 'var(--bg-elevated)' }}
            onError={(e) => { e.target.onerror = null; e.target.src = PLACEHOLDER; }}
            loading="lazy"
        />

        <div style={{ flex: 1, marginTop: '14px' }}>
            <h3 style={{ margin: '0 0 4px 0', fontSize: '1.05rem', color: 'var(--text-primary)', lineHeight: 1.3 }}>
                {juego.titulo}
            </h3>
            <p style={{ margin: '0 0 12px 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                {juego.desarrollador}
            </p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <span className="gd-badge gd-badge-dark">{juego.clasificacion || '—'}</span>
            <span className={`gd-badge ${juego.precio === 0 ? 'gd-badge-green' : 'gd-badge-blue'}`}>
                {juego.precio === 0 ? 'Free to Play' : `$${juego.precio}`}
            </span>
        </div>

        <Link
            to={`/juego/${juego.id}`}
            className="gd-btn gd-btn-primary"
            style={{ width: '100%' }}
        >
            Ver Detalles
        </Link>
    </div>
);

export const JuegosList = () => {
    const { lista: juegos, yaCargados } = useSelector(state => state.juegos);
    const dispatch = useDispatch();

    const [cargando, setCargando] = useState(!yaCargados);
    const [error, setError] = useState(null);
    const [busqueda, setBusqueda] = useState('');
    const [filtroPrecio, setFiltroPrecio] = useState('todos'); // todos | gratis | pago

    useEffect(() => {
        if (!yaCargados) {
            const cargarJuegos = async () => {
                try {
                    const { data } = await gamedexApi.get('/api/v1/juegos');
                    if (Array.isArray(data.datos)) dispatch(setJuegos(data.datos));
                } catch (err) {
                    console.error('Error al cargar juegos:', err);
                    setError('No se pudo cargar el catálogo. Intenta de nuevo más tarde.');
                } finally {
                    setCargando(false);
                }
            };
            cargarJuegos();
        }
    }, [yaCargados, dispatch]);

    const juegosFiltrados = useMemo(() => {
        let resultado = juegos;

        if (busqueda.trim()) {
            const q = busqueda.toLowerCase();
            resultado = resultado.filter(j =>
                j.titulo?.toLowerCase().includes(q) ||
                j.desarrollador?.toLowerCase().includes(q) ||
                (Array.isArray(j.generos) ? j.generos.join(' ') : j.generos || '').toLowerCase().includes(q)
            );
        }

        if (filtroPrecio === 'gratis') resultado = resultado.filter(j => j.precio === 0);
        if (filtroPrecio === 'pago')   resultado = resultado.filter(j => j.precio > 0);

        return resultado;
    }, [juegos, busqueda, filtroPrecio]);

    return (
        <div style={{ padding: '2rem 0' }}>
            {/* Header */}
            <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>
                    Catálogo
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    {cargando ? 'Cargando...' : `${juegosFiltrados.length} juego${juegosFiltrados.length !== 1 ? 's' : ''} encontrado${juegosFiltrados.length !== 1 ? 's' : ''}`}
                </p>
            </div>

            {/* Barra de búsqueda + filtros */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', flex: '1', minWidth: '220px' }}>
                    <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }}>🔍</span>
                    <input
                        className="gd-input"
                        style={{ paddingLeft: '38px' }}
                        type="text"
                        placeholder="Buscar por título, desarrollador o género..."
                        value={busqueda}
                        onChange={e => setBusqueda(e.target.value)}
                    />
                </div>

                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    {[
                        { val: 'todos', label: 'Todos' },
                        { val: 'gratis', label: '🆓 Gratis' },
                        { val: 'pago',   label: '💰 De pago' },
                    ].map(({ val, label }) => (
                        <button
                            key={val}
                            onClick={() => setFiltroPrecio(val)}
                            className={`gd-btn ${filtroPrecio === val ? 'gd-btn-primary' : 'gd-btn-ghost'}`}
                            style={{ padding: '8px 14px', fontSize: '0.85rem' }}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Estado: error */}
            {error && (
                <div style={{ padding: '2rem', textAlign: 'center', backgroundColor: '#2b0f0f', border: '1px solid var(--accent-red)', borderRadius: 'var(--radius-lg)', color: '#fca5a5' }}>
                    <p style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>⚠ {error}</p>
                    <button className="gd-btn gd-btn-danger" onClick={() => { setError(null); setCargando(true); }}>
                        Reintentar
                    </button>
                </div>
            )}

            {/* Estado: cargando skeletons */}
            {!error && cargando && (
                <div className="catalogo-grid">
                    {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
                </div>
            )}

            {/* Estado: sin resultados */}
            {!error && !cargando && juegosFiltrados.length === 0 && (
                <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-muted)' }}>
                    <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎮</p>
                    <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                        {busqueda ? `Sin resultados para "${busqueda}"` : 'No hay juegos registrados.'}
                    </p>
                    {busqueda && (
                        <button className="gd-btn gd-btn-ghost" onClick={() => setBusqueda('')} style={{ marginTop: '1rem' }}>
                            Limpiar búsqueda
                        </button>
                    )}
                </div>
            )}

            {/* Grid de juegos */}
            {!error && !cargando && juegosFiltrados.length > 0 && (
                <div className="catalogo-grid">
                    {juegosFiltrados.map(juego => <GameCard key={juego.id} juego={juego} />)}
                </div>
            )}
        </div>
    );
};
