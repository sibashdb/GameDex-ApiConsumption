import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './Components/Navbar';
import { JuegosList } from './Components/JuegosList';
import { JuegoDetalle } from './Components/JuegoDetalle';
import { AdminPanel } from './Components/AdminPanel';

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