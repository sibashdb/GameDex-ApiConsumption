import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './Components/Navbar';
import { JuegosList } from './Components/JuegosList';
import { JuegoDetalle } from './Components/JuegoDetalle';
import { AdminPanel } from './Components/AdminPanel';
import { MiColeccion } from './Components/MiColeccion';
import { Login } from './Components/Login';
import { Registro } from './Components/Registro';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main style={{ padding: '0 2rem' }}>
        <Routes>
          <Route path="/" element={<JuegosList />} />
          <Route path="/juego/:id" element={<JuegoDetalle />} />
          <Route path="/mi-coleccion" element={<MiColeccion />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;