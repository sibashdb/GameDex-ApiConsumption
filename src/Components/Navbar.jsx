import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../Store/userSlice';

export const Navbar = () => {
    const dispatch = useDispatch();
    const { username, isLoggedIn } = useSelector(state => state.user);

    return (
        <nav style={{ 
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '1rem 2rem', backgroundColor: '#130f22', color: 'white', borderBottom: '2px solid #261f44'
        }}>
            <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                <Link to="/" style={{ color: '#a78bfa', textDecoration: 'none', fontSize: '1.5rem', fontWeight: 'bold' }}>
                    🎮 GameDex
                </Link>
                <Link to="/" style={{ color: '#cbd5e1', textDecoration: 'none' }}>Catálogo</Link>
                {isLoggedIn && <Link to="/mi-coleccion" style={{ color: '#cbd5e1', textDecoration: 'none' }}>Mi Colección</Link>}
                <Link to="/admin" style={{ color: '#f87171', textDecoration: 'none' }}>Panel Admin</Link>
            </div>

            <div>
                {isLoggedIn ? (
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <span style={{ color: '#a78bfa', fontWeight: 'bold' }}>👾 {username}</span>
                        <button 
                            onClick={() => dispatch(logout())}
                            style={{ padding: '6px 12px', backgroundColor: '#3c316a', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }}
                        >
                            Salir
                        </button>
                    </div>
                ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Link to="/login" style={{ padding: '6px 12px', backgroundColor: '#1c1632', color: '#a78bfa', border: '1px solid #3c316a', borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold' }}>
                            Iniciar Sesión
                        </Link>
                        <Link to="/registro" style={{ padding: '6px 12px', backgroundColor: '#6366f1', color: 'white', border: 'none', borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold' }}>
                            Crear Usuario
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
};