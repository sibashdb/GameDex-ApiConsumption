import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { setUser } from '../Store/userSlice';
import gamedexApi from '../api/GamedexApi';
import { useToast } from '../hooks/useToast';

export const Login = () => {
    const dispatch  = useDispatch();
    const navigate  = useNavigate();
    const toast     = useToast();
    const [cargando, setCargando] = useState(false);

    const manejarLogin = async (e) => {
        e.preventDefault();
        setCargando(true);
        const payload = Object.fromEntries(new FormData(e.target));
        try {
            const { data } = await gamedexApi.post('/api/v1/auth/login', payload);
            dispatch(setUser(data));
            toast.success('¡Bienvenido de vuelta!');
            navigate('/');
        } catch {
            toast.error('Credenciales incorrectas. Intenta de nuevo.');
        } finally {
            setCargando(false);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '75vh', padding: '2rem' }}>
            <div className="gd-card" style={{ padding: '2.5rem', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🎮</div>
                <h2 style={{ color: 'var(--accent-violet)', marginBottom: '0.5rem', fontSize: '1.75rem' }}>Bienvenido</h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.9rem' }}>Ingresa a tu cuenta GameDex</p>

                <form onSubmit={manejarLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', textAlign: 'left' }}>
                    <div className="form-field">
                        <label className="gd-label">Correo electrónico</label>
                        <input name="email" type="email" required className="gd-input" placeholder="tu@correo.com" />
                    </div>
                    <div className="form-field">
                        <label className="gd-label">Contraseña</label>
                        <input name="password" type="password" required className="gd-input" placeholder="••••••••" />
                    </div>
                    <button type="submit" className="gd-btn gd-btn-success" style={{ width: '100%', padding: '12px', fontSize: '1rem', marginTop: '0.5rem' }} disabled={cargando}>
                        {cargando ? 'Ingresando...' : 'Iniciar sesión'}
                    </button>
                </form>

                <p style={{ color: 'var(--text-muted)', marginTop: '2rem', fontSize: '0.9rem' }}>
                    ¿No tienes cuenta?{' '}
                    <Link to="/registro" style={{ color: 'var(--accent-violet)', fontWeight: 700, textDecoration: 'none' }}>
                        Regístrate aquí
                    </Link>
                </p>
            </div>
        </div>
    );
};
