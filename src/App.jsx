import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './Components/Navbar';
import { JuegosList } from './Components/JuegosList';
import { JuegoDetalle } from './Components/JuegoDetalle';
import { AdminPanel } from './Components/AdminPanel';
import { MiColeccion } from './Components/MiColeccion';
import { Login } from './Components/Login';
import { Registro } from './Components/Registro';
import { ProtectedRoute } from './Components/ProtectedRoute';
import { ToastProvider } from './hooks/useToast';

function App() {
    return (
        <BrowserRouter>
            <ToastProvider>
                <Navbar />
                <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 2rem' }}>
                    <Routes>
                        <Route path="/"              element={<JuegosList />} />
                        <Route path="/juego/:id"     element={<JuegoDetalle />} />
                        <Route path="/login"         element={<Login />} />
                        <Route path="/registro"      element={<Registro />} />

                        {/* Rutas protegidas */}
                        <Route path="/mi-coleccion" element={
                            <ProtectedRoute>
                                <MiColeccion />
                            </ProtectedRoute>
                        } />

                        {/* Admin: sólo protegido por clave interna */}
                        <Route path="/admin" element={<AdminPanel />} />
                    </Routes>
                </main>
            </ToastProvider>
        </BrowserRouter>
    );
}

export default App;
