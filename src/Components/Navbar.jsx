import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../Store/userSlice';
import { useToast } from '../hooks/useToast';

const NavLink = ({ to, children }) => {
    const { pathname } = useLocation();
    const active = pathname === to;
    return (
        <Link
            to={to}
            style={{
                color: active ? 'var(--accent-violet)' : 'var(--text-secondary)',
                textDecoration: 'none',
                fontWeight: active ? 700 : 500,
                fontSize: '0.9rem',
                padding: '4px 0',
                borderBottom: `2px solid ${active ? 'var(--accent-violet)' : 'transparent'}`,
                transition: 'color 0.2s, border-color 0.2s',
            }}
        >
            {children}
        </Link>
    );
};

export const Navbar = () => {
    const dispatch = useDispatch();
    const toast = useToast();
    const { username, isLoggedIn } = useSelector(state => state.user);
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = () => {
        dispatch(logout());
        toast.info('Sesión cerrada. ¡Hasta pronto!');
    };

    return (
        <nav style={{
            position: 'sticky', top: 0, zIndex: 100,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '0 2rem', height: '60px',
            backgroundColor: 'rgba(19, 15, 34, 0.92)',
            backdropFilter: 'blur(12px)',
            borderBottom: '1px solid var(--border-subtle)',
        }}>
            {/* Logo */}
            <Link to="/" style={{ color: 'var(--accent-violet)', textDecoration: 'none', fontSize: '1.3rem', fontWeight: 800, letterSpacing: '-0.5px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '1.5rem' }}>🎮</span> GameDex
            </Link>

            {/* Links */}
            <div style={{ display: 'flex', gap: '1.75rem', alignItems: 'center' }}>
                <NavLink to="/">Catálogo</NavLink>
                {isLoggedIn && <NavLink to="/mi-coleccion">Mi Colección</NavLink>}
                <NavLink to="/admin">Admin</NavLink>
            </div>

            {/* Auth section */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {isLoggedIn ? (
                    <>
                        <span style={{
                            color: 'var(--accent-violet)', fontWeight: 700, fontSize: '0.88rem',
                            backgroundColor: 'var(--bg-elevated)', padding: '5px 12px',
                            borderRadius: '20px', border: '1px solid var(--border-muted)'
                        }}>
                            👾 {username}
                        </span>
                        <button onClick={handleLogout} className="gd-btn gd-btn-ghost" style={{ padding: '6px 14px', fontSize: '0.85rem' }}>
                            Salir
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login" className="gd-btn gd-btn-ghost" style={{ padding: '6px 14px', fontSize: '0.85rem' }}>
                            Iniciar Sesión
                        </Link>
                        <Link to="/registro" className="gd-btn gd-btn-primary" style={{ padding: '6px 14px', fontSize: '0.85rem' }}>
                            Crear cuenta
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
};
