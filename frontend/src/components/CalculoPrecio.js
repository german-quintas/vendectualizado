import React, { useState } from 'react';

const CalcularPrecio = () => {
  // Estados para manejar los productos, márgenes y errores
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(null);
  
  // Estados para los márgenes ingresados por el usuario
  const [margenGanancia, setMargenGanancia] = useState('');
  const [margenCosto, setMargenCosto] = useState('');

  // Función para hacer la solicitud cuando el usuario haga clic en "Calcular"
  const handleCalcularPrecios = async () => {
    setLoading(true);  // Inicia el estado de carga
    setError(null);  // Limpiar cualquier error previo

    try {
      // Hacer la solicitud GET al backend con los márgenes ingresados por el usuario
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/calcular-precios?margenGanancia=${margenGanancia || ''}&margenCosto=${margenCosto || ''}`);

      // Verificar que la respuesta sea válida
      if (!response.ok) {
        throw new Error('Hubo un error al obtener los precios');
      }

      // Verificar que la respuesta sea JSON
      const contentType = response.headers.get('Content-Type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        setProductos(data);  // Actualiza los productos con los datos recibidos
      } else {
        throw new Error('La respuesta no es JSON');
      }
    } catch (error) {
      setError(error.message);  // Si ocurre un error, actualizar el estado
    } finally {
      setLoading(false);  // Finaliza el estado de carga
    }
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

      {/* Formulario para ingresar márgenes */}
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

      {/* Mostrar la tabla de productos */}
      {productos.length > 0 && (
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
            {productos.map((producto) => (
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
