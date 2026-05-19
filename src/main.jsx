import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { Provider } from 'react-redux'
// Nota: asegúrate de que tu archivo se llame store.js o store.jsx según lo hayas creado
import { store } from './Store/store.jsx'; 

// Agrega esto para pintar el fondo de todo el sitio web
document.body.style.backgroundColor = '#0b0813'; // Un morado ultra oscuro y elegante
document.body.style.margin = '0';
document.body.style.color = '#f3effa'; // Texto blanco con un levísimo toque lila

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
)