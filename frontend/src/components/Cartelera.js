
import React, { useState, useEffect } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css'; 
import 'slick-carousel/slick/slick-theme.css'; 
//import './App.css'; // Importa el CSS modificado

const CalcularPrecio = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [margenGanancia, setMargenGanancia] = useState('');
  const [margenCosto, setMargenCosto] = useState('');

  const handleCalcularPrecios = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/calcular-precios?margenGanancia=${margenGanancia || ''}&margenCosto=${margenCosto || ''}`);
      if (!response.ok) {
        throw new Error('Hubo un error al obtener los precios');
      }

      const contentType = response.headers.get('Content-Type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        setProductos(data);
      } else {
        throw new Error('La respuesta no es JSON');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchProductos = async () => {
      setLoading(true);
      setError(null);

      try {
const response = await fetch(`${process.env.REACT_APP_API_URL}/api/calcular-precios`);
        if (!response.ok) {
          throw new Error('Hubo un error al obtener los productos');
        }

        const contentType = response.headers.get('Content-Type');
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          setProductos(data);
        } else {
          throw new Error('La respuesta no es JSON');
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

 

    const settings = {
        dots: true, // Muestra los puntos de navegación, puedes dejarlo o quitarlo si no lo deseas
        infinite: true, // El slider se reinicia automáticamente
        speed: 500, // Velocidad de transición
        slidesToShow: 3, // Muestra 3 productos a la vez
        slidesToScroll: 1, // Desplaza 1 producto por vez
        autoplay: true, // Reproduce automáticamente
        autoplaySpeed: 3000, // Intervalo de tiempo para cada transición
        centerMode: false, // Desactiva el modo centrado para evitar el deslizamiento de un producto a medio camino
        focusOnSelect: true, // Selecciona el slide al hacer clic
        prevArrow: null, // Desactiva la flecha izquierda
        nextArrow: null, // Desactiva la flecha derecha
        appendDots: (dots) => <ul style={{ margin: '0px' }}>{dots}</ul> // Opcional: puedes personalizar los puntos de navegación
      };


  return (
    <div className="App">
      <h1>Calcular Precios de Productos</h1>

      <div>
        <label>
          Margen de Ganancia (%): 
          <input
            type="number"
            value={margenGanancia}
            onChange={(e) => setMargenGanancia(e.target.value)}
            placeholder="Ingrese margen de ganancia"
          />
        </label>
        <br />
        <label>
          Margen de Costo (%): 
          <input
            type="number"
            value={margenCosto}
            onChange={(e) => setMargenCosto(e.target.value)}
            placeholder="Ingrese margen de costo"
          />
        </label>
        <br />
        <button onClick={handleCalcularPrecios}>Calcular Precios</button>
      </div>

      {/* Slider que muestra 3 productos a la vez */}
      {productos.length > 0 && (
        <div style={{ marginTop: '30px' }}>
          <Slider {...settings}>
            {productos.map((producto) => (
              <div key={producto.idproducto} className="producto-card">
                <h2>{producto.nombreproducto}</h2>
                <p>${producto.precioVenta}</p>
              </div>
            ))}
          </Slider>
        </div>
      )}
    </div>
  );
};

export default CalcularPrecio;
