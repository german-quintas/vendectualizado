import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import './App.css';

import CalculoPrecio from './components/CalculoPrecio';
import Cartelera from './components/Cartelera';
import Galeria from './components/Galeria';
import MateriaPrima from './components/MateriaPrima';
import Producto from './components/Producto';
import Relaciones from './components/Relaciones';
import TablaPrecios from './components/TablaPrecios';

function App() {
  return (
    <Router>
      <div style={{ padding: '20px' }}>
        <nav>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <li><Link to="/">Inicio</Link></li>
            {/*<li><Link to="/calculo-precio">Cálculo Precio</Link></li>*/}
            {/*<li><Link to="/cartelera">Cartelera</Link></li>*/}
            <li><Link to="/galeria">Cartelera Digital</Link></li>
            <li><Link to="/materia-prima">Materia Prima</Link></li>
            <li><Link to="/producto">Producto</Link></li>
            <li><Link to="/relaciones">Relaciones</Link></li>
            <li><Link to="/tabla-precios">Tabla Precios</Link></li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<h2>Bienvenido al sistema</h2>} />
          {/*<Route path="/calculo-precio" element={<CalculoPrecio />} />*/}
          {/*<Route path="/cartelera" element={<Cartelera />} />*/}
          <Route path="/galeria" element={<Galeria />} />
          <Route path="/materia-prima" element={<MateriaPrima />} />
          <Route path="/producto" element={<Producto />} />
          <Route path="/relaciones" element={<Relaciones />} />
          <Route path="/tabla-precios" element={<TablaPrecios />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
