import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { setUser } from '../Store/userSlice';
import gamedexApi from '../api/GamedexApi';

export const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate(); // Herramienta para redireccionar

    const manejarLogin = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const payload = Object.fromEntries(formData.entries());

        try {
            const respuesta = await gamedexApi.post('/api/v1/auth/login', payload);
            
            // AGREGA ESTA LÍNEA PARA VER QUÉ NOS MANDA TU COMPAÑERO:
            console.log("Datos del Login:", respuesta.data); 
            
            dispatch(setUser(respuesta.data));
            navigate('/'); 
        } catch (error) {
            console.error("Error al iniciar sesión:", error);
            alert("Credenciales incorrectas. Intenta de nuevo.");
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh', fontFamily: 'system-ui, sans-serif' }}>
            <div style={{ backgroundColor: '#130f22', padding: '3rem', borderRadius: '12px', border: '1px solid #261f44', width: '100%', maxWidth: '400px', textAlign: 'center', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>
                <h2 style={{ color: '#a78bfa', marginTop: 0, marginBottom: '2rem', fontSize: '2rem' }}>Bienvenido</h2>
                
                <form onSubmit={manejarLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ textAlign: 'left' }}>
                        <label style={{ color: '#cbd5e1', fontSize: '0.9rem', marginBottom: '5px', display: 'block' }}>Correo Electrónico</label>
                        <input name="email" type="email" required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #3c316a', backgroundColor: '#1c1632', color: 'white', boxSizing: 'border-box' }} />
                    </div>
                    
                    <div style={{ textAlign: 'left' }}>
                        <label style={{ color: '#cbd5e1', fontSize: '0.9rem', marginBottom: '5px', display: 'block' }}>Contraseña</label>
                        <input name="password" type="password" required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #3c316a', backgroundColor: '#1c1632', color: 'white', boxSizing: 'border-box' }} />
                    </div>

                    <button type="submit" style={{ padding: '12px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.1rem', marginTop: '1rem' }}>
                        Iniciar Sesión
                    </button>
                </form>

                <p style={{ color: '#9ca3af', marginTop: '2rem', fontSize: '0.9rem' }}>
                    ¿No tienes cuenta? <Link to="/registro" style={{ color: '#a78bfa', textDecoration: 'none', fontWeight: 'bold' }}>Regístrate aquí</Link>
                </p>
            </div>
        </div>
    );
};