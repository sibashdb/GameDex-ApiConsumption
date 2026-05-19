import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { JuegosList } from './components/JuegosList';
import { JuegoDetalle } from './components/JuegoDetalle';
import { AdminPanel } from './components/AdminPanel';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main style={{ padding: '0 2rem' }}>
        <Routes>
          <Route path="/" element={<JuegosList />} />
          <Route path="/juego/:id" element={<JuegoDetalle />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;