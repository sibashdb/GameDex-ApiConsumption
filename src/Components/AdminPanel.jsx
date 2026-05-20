import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setJuegos, addJuego, removeJuego } from '../Store/juegosSlice';
import gamedexApi from '../api/GamedexApi';
import { useToast } from '../hooks/useToast';

const FORM_VACIO = { titulo: '', desarrollador: '', precio: 0, clasificacion: '', imagen_url: '', generos: '', plataformas: '' };

export const AdminPanel = () => {
    const dispatch = useDispatch();
    const toast    = useToast();
    const { lista: juegos, yaCargados } = useSelector(state => state.juegos);

    const [acceso, setAcceso]         = useState(false);
    const [pwdInput, setPwdInput]     = useState('');
    const [pwdToken, setPwdToken]     = useState('');
    const [errorPwd, setErrorPwd]     = useState('');
    const [cargando, setCargando]     = useState(false);
    const [vistaForm, setVistaForm]   = useState(false);
    const [eliminando, setEliminando] = useState(null);
    const [enviando, setEnviando]     = useState(false);
    const [formulario, setFormulario] = useState(FORM_VACIO);
    const [busqueda, setBusqueda]     = useState('');

    useEffect(() => {
        if (acceso && !yaCargados) cargarInventario();
    }, [acceso, yaCargados]);

    const cargarInventario = async () => {
        setCargando(true);
        try {
            const { data } = await gamedexApi.get('/api/v1/juegos');
            if (Array.isArray(data.datos)) dispatch(setJuegos(data.datos));
        } catch {
            toast.error('No se pudo cargar el inventario.');
        } finally {
            setCargando(false);
        }
    };

    const manejarIngreso = (e) => {
        e.preventDefault();
        const correcta = import.meta.env.VITE_ADMIN_PASSWORD;
        if (pwdInput === correcta) {
            setPwdToken(pwdInput);
            setAcceso(true);
        } else {
            setErrorPwd('Contraseña incorrecta. Acceso denegado.');
            setPwdInput('');
        }
    };

    const eliminarJuego = async (id, titulo) => {
        if (!window.confirm(`¿Eliminar "${titulo}"? Esta acción no se puede deshacer.`)) return;
        setEliminando(id);
        try {
            await gamedexApi.delete(`/api/v1/admin/juegos/${id}`, { headers: { 'x-token': pwdToken } });
            dispatch(removeJuego(id));
            toast.success(`"${titulo}" eliminado correctamente.`);
        } catch {
            toast.error('No se pudo eliminar el juego.');
        } finally {
            setEliminando(null);
        }
    };

    const cambiarCampo = (e) => {
        const { name, value } = e.target;
        setFormulario(prev => ({ ...prev, [name]: name === 'precio' ? Number(value) : value }));
    };

    const enviarJuego = async (e) => {
        e.preventDefault();
        setEnviando(true);
        const payload = {
            ...formulario,
            generos:     formulario.generos    ? formulario.generos.split(',').map(g => g.trim())    : [],
            plataformas: formulario.plataformas ? formulario.plataformas.split(',').map(p => p.trim()) : [],
        };
        try {
            const { data } = await gamedexApi.post('/api/v1/admin/juegos', payload, { headers: { 'x-token': pwdToken } });
            dispatch(addJuego(data.datos || data));
            toast.success(`"${formulario.titulo}" registrado con éxito.`);
            setFormulario(FORM_VACIO);
            setVistaForm(false);
        } catch (err) {
            const msg = err.response?.data?.detail;
            toast.error(typeof msg === 'string' ? msg : msg?.[0]?.msg || 'Error al registrar el juego.');
        } finally {
            setEnviando(false);
        }
    };

    const juegosFiltrados = busqueda.trim()
        ? juegos.filter(j => j.titulo?.toLowerCase().includes(busqueda.toLowerCase()) || j.desarrollador?.toLowerCase().includes(busqueda.toLowerCase()))
        : juegos;

    // --- Gate de acceso ---
    if (!acceso) return (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10vh', padding: '1rem' }}>
            <form onSubmit={manejarIngreso} className="gd-card" style={{ padding: '2.5rem', width: '100%', maxWidth: '360px', textAlign: 'center' }}>
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🔐</div>
                <h2 style={{ marginBottom: '0.5rem' }}>Acceso Restringido</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.75rem' }}>Ingresa la clave de administrador</p>

                <div className="form-field" style={{ textAlign: 'left', marginBottom: '1rem' }}>
                    <label className="gd-label">Contraseña de admin</label>
                    <input
                        type="password" value={pwdInput} onChange={e => { setPwdInput(e.target.value); setErrorPwd(''); }}
                        placeholder="••••••••" className="gd-input"
                        style={{ borderColor: errorPwd ? 'var(--accent-red)' : undefined }}
                    />
                    {errorPwd && <p style={{ color: 'var(--accent-red)', fontSize: '0.82rem', marginTop: '6px' }}>{errorPwd}</p>}
                </div>
                <button type="submit" className="gd-btn gd-btn-primary" style={{ width: '100%', padding: '11px' }}>
                    Entrar al panel
                </button>
            </form>
        </div>
    );

    return (
        <div style={{ padding: '2rem 0' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '4px' }}>
                        Panel de Administración
                    </h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{juegos.length} títulos en el catálogo</p>
                </div>
                <button
                    onClick={() => setVistaForm(!vistaForm)}
                    className={`gd-btn ${vistaForm ? 'gd-btn-ghost' : 'gd-btn-success'}`}
                >
                    {vistaForm ? '← Volver a la tabla' : '+ Registrar juego'}
                </button>
            </div>

            {cargando ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Cargando inventario...</div>
            ) : vistaForm ? (
                /* ---- Formulario de nuevo juego ---- */
                <div className="gd-card" style={{ padding: '2rem', maxWidth: '560px' }}>
                    <h3 style={{ marginBottom: '1.5rem', color: 'var(--accent-violet)' }}>Registrar nuevo título</h3>
                    <form onSubmit={enviarJuego} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                        {[
                            { name: 'titulo',       label: 'Título *',           placeholder: 'Ej. Fortnite',          type: 'text' },
                            { name: 'desarrollador',label: 'Desarrollador *',     placeholder: 'Ej. Epic Games',        type: 'text' },
                            { name: 'clasificacion',label: 'Clasificación',       placeholder: 'E, T, M...',            type: 'text' },
                            { name: 'imagen_url',   label: 'URL de portada',      placeholder: 'https://...',           type: 'url'  },
                            { name: 'generos',      label: 'Géneros (separados por coma)', placeholder: 'Acción, RPG', type: 'text' },
                            { name: 'plataformas',  label: 'Plataformas (separadas por coma)', placeholder: 'PC, Xbox', type: 'text' },
                        ].map(f => (
                            <div key={f.name} className="form-field">
                                <label className="gd-label">{f.label}</label>
                                <input name={f.name} type={f.type} value={formulario[f.name]} onChange={cambiarCampo} placeholder={f.placeholder} className="gd-input" required={f.name === 'titulo' || f.name === 'desarrollador'} />
                            </div>
                        ))}
                        <div className="form-field">
                            <label className="gd-label">Precio (MXN) *</label>
                            <input name="precio" type="number" min="0" step="0.01" value={formulario.precio} onChange={cambiarCampo} className="gd-input" required />
                        </div>
                        <button type="submit" className="gd-btn gd-btn-primary" style={{ marginTop: '0.5rem', padding: '12px' }} disabled={enviando}>
                            {enviando ? 'Guardando...' : 'Guardar en base de datos'}
                        </button>
                    </form>
                </div>
            ) : (
                /* ---- Tabla de juegos ---- */
                <>
                    <div style={{ marginBottom: '1.25rem' }}>
                        <input
                            className="gd-input"
                            style={{ maxWidth: '360px' }}
                            placeholder="🔍 Buscar en el catálogo..."
                            value={busqueda}
                            onChange={e => setBusqueda(e.target.value)}
                        />
                    </div>
                    <div style={{ overflowX: 'auto', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                            <thead>
                                <tr style={{ backgroundColor: 'var(--bg-elevated)', color: 'var(--text-secondary)' }}>
                                    {['ID', 'Título', 'Desarrollador', 'Precio', 'Acción'].map(h => (
                                        <th key={h} style={{ padding: '12px 16px', textAlign: h === 'Acción' ? 'center' : 'left', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {juegosFiltrados.map((j, idx) => (
                                    <tr key={j.id} style={{ borderTop: '1px solid var(--border-subtle)', backgroundColor: idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)' }}>
                                        <td style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>{j.id}</td>
                                        <td style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--text-primary)' }}>{j.titulo}</td>
                                        <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>{j.desarrollador}</td>
                                        <td style={{ padding: '12px 16px' }}>
                                            <span className={`gd-badge ${j.precio === 0 ? 'gd-badge-green' : 'gd-badge-blue'}`}>
                                                {j.precio === 0 ? 'Free' : `$${j.precio}`}
                                            </span>
                                        </td>
                                        <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                                            <button
                                                onClick={() => eliminarJuego(j.id, j.titulo)}
                                                className="gd-btn gd-btn-danger"
                                                style={{ padding: '5px 12px', fontSize: '0.82rem' }}
                                                disabled={eliminando === j.id}
                                            >
                                                {eliminando === j.id ? '...' : 'Eliminar'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {juegosFiltrados.length === 0 && (
                            <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>Sin resultados.</p>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};
