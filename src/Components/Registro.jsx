import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { setUser } from '../Store/userSlice';
import gamedexApi from '../api/GamedexApi';
import { useToast } from '../hooks/useToast';

export const Registro = () => {
    const dispatch  = useDispatch();
    const navigate  = useNavigate();
    const toast     = useToast();
    const [cargando, setCargando] = useState(false);

    const manejarRegistro = async (e) => {
        e.preventDefault();
        setCargando(true);
        const payload = Object.fromEntries(new FormData(e.target));
        try {
            const { data } = await gamedexApi.post('/api/v1/auth/registrar', payload);
            dispatch(setUser(data));
            toast.success('¡Cuenta creada con éxito!');
            navigate('/');
        } catch (err) {
            const msg = err.response?.data?.detail;
            toast.error(typeof msg === 'string' ? msg : 'El correo o usuario ya existe.');
        } finally {
            setCargando(false);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '75vh', padding: '2rem' }}>
            <div className="gd-card" style={{ padding: '2.5rem', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🕹️</div>
                <h2 style={{ color: 'var(--accent-indigo)', marginBottom: '0.5rem', fontSize: '1.75rem' }}>Crear perfil</h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.9rem' }}>Únete a la comunidad GameDex</p>

                <form onSubmit={manejarRegistro} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', textAlign: 'left' }}>
                    <div className="form-field">
                        <label className="gd-label">Nombre de usuario</label>
                        <input name="username" type="text" required className="gd-input" placeholder="GamerPro123" />
                    </div>
                    <div className="form-field">
                        <label className="gd-label">Correo electrónico</label>
                        <input name="email" type="email" required className="gd-input" placeholder="tu@correo.com" />
                    </div>
                    <div className="form-field">
                        <label className="gd-label">Contraseña</label>
                        <input name="password" type="password" required minLength={6} className="gd-input" placeholder="Mínimo 6 caracteres" />
                    </div>
                    <button type="submit" className="gd-btn gd-btn-primary" style={{ width: '100%', padding: '12px', fontSize: '1rem', marginTop: '0.5rem' }} disabled={cargando}>
                        {cargando ? 'Creando cuenta...' : 'Crear cuenta'}
                    </button>
                </form>

                <p style={{ color: 'var(--text-muted)', marginTop: '2rem', fontSize: '0.9rem' }}>
                    ¿Ya tienes cuenta?{' '}
                    <Link to="/login" style={{ color: 'var(--accent-indigo)', fontWeight: 700, textDecoration: 'none' }}>
                        Inicia sesión aquí
                    </Link>
                </p>
            </div>
        </div>
    );
};
