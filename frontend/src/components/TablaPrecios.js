import React, { useState, useEffect } from 'react';

const CalcularPrecio = () => {
  // Estados para manejar los productos, márgenes y errores
  const [productos, setProductos] = useState([]);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Estados para los márgenes ingresados por el usuario
  const [margenGanancia, setMargenGanancia] = useState('');
  const [margenCosto, setMargenCosto] = useState('');
  
  // Estado para el buscador
  const [busqueda, setBusqueda] = useState('');

  // Función para hacer la solicitud cuando el usuario haga clic en "Calcular"
  const handleCalcularPrecios = async () => {
    setLoading(true);  // Inicia el estado de carga
    setError(null);  // Limpiar cualquier error previo

    try {
      // Hacer la solicitud GET al backend con los márgenes ingresados por el usuario
      const response = await fetch(`http://localhost:3001/api/calcular-precios?margenGanancia=${margenGanancia || ''}&margenCosto=${margenCosto || ''}`);

      // Verificar que la respuesta sea válida
      if (!response.ok) {
        throw new Error('Hubo un error al obtener los precios');
      }

      // Verificar que la respuesta sea JSON
      const contentType = response.headers.get('Content-Type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        setProductos(data);  // Actualiza los productos con los datos recibidos
        setProductosFiltrados(data);  // Asegurarse de que los productos filtrados se actualicen también
      } else {
        throw new Error('La respuesta no es JSON');
      }
    } catch (error) {
      setError(error.message);  // Si ocurre un error, actualizar el estado
    } finally {
      setLoading(false);  // Finaliza el estado de carga
    }
  };

  // useEffect para llamar a handleCalcularPrecios sin parámetros al cargar la página
  useEffect(() => {
    const fetchProductos = async () => {
      setLoading(true);
      setError(null);

      try {
        // Hacer la solicitud GET al backend sin parámetros para obtener los productos inicialmente
        const response = await fetch('http://localhost:3001/api/calcular-precios');

        if (!response.ok) {
          throw new Error('Hubo un error al obtener los productos');
        }

        const contentType = response.headers.get('Content-Type');
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json();
          setProductos(data);  // Actualiza los productos con los datos recibidos
          setProductosFiltrados(data);  // Asegurarse de que los productos filtrados se actualicen también
        } else {
          throw new Error('La respuesta no es JSON');
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProductos(); // Llama a la función para obtener los productos al cargar
  }, []); // Solo se ejecuta al montar el componente

  // Función para manejar el cambio en el buscador
  const handleBusqueda = (e) => {
    setBusqueda(e.target.value);
    
    // Filtrar los productos por nombre cuando se escribe en el buscador
    const productosFiltrados = productos.filter((producto) =>
      producto.nombreproducto.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setProductosFiltrados(productosFiltrados); // Actualizar la lista de productos filtrados
  };

  // Si está cargando, mostrar mensaje de carga
  if (loading) {
    return <div>Loading...</div>;
  }

  // Si ocurrió un error, mostrar el mensaje de error
  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Calcular Precios de Productos</h1>

      {/* Formulario para ingresar márgenes y buscador */}
      <div style={{ marginBottom: '20px' }}>
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
        <br />

        {/* Buscador */}
        <input
          type="text"
          value={busqueda}
          onChange={handleBusqueda}
          placeholder="Buscar por nombre de producto"
          style={{ marginTop: '10px', padding: '5px' }}
        />
      </div>

      {/* Mostrar la tabla de productos si existen */}
      {productosFiltrados.length > 0 && (
        <table border="1">
          <thead>
            <tr>
              <th>ID Producto</th>
              <th>Nombre</th>
              <th>Precio Costo</th>
              <th>Precio Venta</th>
              <th>Precio Sugerido</th>
            </tr>
          </thead>
          <tbody>
            {productosFiltrados.map((producto) => (
              <tr key={producto.idproducto}>
                <td>{producto.idproducto}</td>
                <td>{producto.nombreproducto}</td>
                <td>{producto.precioCosto}</td>
                <td>{producto.precioVenta}</td>
                <td>{producto.precioSugerido === 'No hay sugerencias' ? 'No disponible' : producto.precioSugerido || 'No disponible'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

    </div>
  );
};

export default CalcularPrecio;
