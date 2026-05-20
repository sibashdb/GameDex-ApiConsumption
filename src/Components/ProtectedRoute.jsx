import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

/**
 * Redirige a /login si el usuario no está autenticado.
 * Uso: <ProtectedRoute><MiColeccion /></ProtectedRoute>
 */
export const ProtectedRoute = ({ children, redirectTo = '/login' }) => {
    const { isLoggedIn } = useSelector(state => state.user);
    return isLoggedIn ? children : <Navigate to={redirectTo} replace />;
};
