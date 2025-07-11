import React, { useState, useEffect } from 'react';

const Relaciones = () => {
    const [productos, setProductos] = useState([]);
    const [productoFiltrado, setProductoFiltrado] = useState([]);
    const [materiasPrimas, setMateriasPrimas] = useState([]);
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);
    const [paginaActual, setPaginaActual] = useState(1);
    const materiasPorPagina = 6;

    // Buscar productos
    useEffect(() => {
        fetch('http://localhost:3001/productos')
            .then((response) => response.json())
            .then((data) => {
                setProductos(data);
                setProductoFiltrado(data);
            })
            .catch((error) => console.error('Error al cargar productos:', error));
    }, []);

    // Buscar materias primas
    useEffect(() => {
        fetch('http://localhost:3001/materias-primas')
            .then((response) => response.json())
            .then((data) => setMateriasPrimas(data))
            .catch((error) => console.error('Error al cargar materias primas:', error));
    }, []);

    // Manejar búsqueda en vivo
    const manejarBusqueda = (e) => {
        const termino = e.target.value.toLowerCase();
        setProductoFiltrado(
            productos.filter((producto) =>
                (producto.nombreproducto?.toLowerCase().includes(termino) || 
                 producto.codigoproducto?.toLowerCase().includes(termino))
            )
        );
    };

    // Guardar relaciones

    // Guardar relaciones
    const guardarRelaciones = async () => {
        const relaciones = materiasPrimas
            .filter((materia) => materia.seleccionada)
            .map((materia) => ({
                idMateriaPrima: materia.idmateriaprima,
                cantidadUsada: materia.cantidadUsada || 1,
            }));
    
        try {
            const response = await fetch(`http://localhost:3001/productos/${productoSeleccionado.idproducto}/materias-primas`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ relaciones }),
            });
    
            if (response.ok) {
                alert('Relaciones guardadas correctamente');
            } else {
                const errorResponse = await response.json();  // Obtener detalles del error
                alert(`Error al guardar relaciones: ${errorResponse.error || errorResponse.message}`);
                console.error('Detalles del error:', errorResponse);
            }
        } catch (error) {
            console.error('Error al guardar relaciones:', error);
            alert('Error al guardar relaciones: Ver consola para más detalles.');
        }
    };
    
// Seleccionar producto
const seleccionarProducto = async (producto) => {
    setProductoSeleccionado(producto);

    try {
        const response = await fetch(`http://localhost:3001/productos/${producto.idproducto}/materias-primas`);
        const relaciones = await response.json();

        setMateriasPrimas((prev) =>
            prev.map((materia) => {
                const relacion = relaciones.find(
                    (rel) => rel.idmateriaprima === materia.idmateriaprima
                );
                return {
                    ...materia,
                    seleccionada: !!relacion,
                    cantidadUsada: relacion ? relacion.cantidadusada : null,
                };
            })
        );
    } catch (error) {
        console.error('Error al cargar relaciones:', error);
    }
};



    // Cambiar página
    const cambiarPagina = (pagina) => setPaginaActual(pagina);

    // Materias primas paginadas
    const materiasPaginadas = materiasPrimas.slice(
        (paginaActual - 1) * materiasPorPagina,
        paginaActual * materiasPorPagina
    );

    return (
        <div>
            <h1>Relaciones Producto - Materia Prima</h1>

            {/* Búsqueda en vivo */}
            <input
                type="text"
                placeholder="Buscar producto por nombre o código"
                onChange={manejarBusqueda}
            />

            {/* Lista de productos filtrados */}
            {/*<ul>
    {productoFiltrado.map((producto) => (
        <li
            key={producto.idproducto}
            onClick={() => seleccionarProducto(producto)}
            style={{
                cursor: 'pointer',
                fontWeight: productoSeleccionado?.idproducto === producto.idproducto ? 'bold' : 'normal',
            }}
        >
            {producto.nombreproducto} (Código: {producto.codigoproducto})
        </li>
    ))}
</ul>*/}
<div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
  {productoFiltrado.map((producto) => {
    const seleccionado = productoSeleccionado?.idproducto === producto.idproducto;
    return (
      <div
        key={producto.idproducto}
        onClick={() => seleccionarProducto(producto)}
        style={{
          cursor: 'pointer',
          border: seleccionado ? '3px solid #007BFF' : '1px solid #ccc',
          borderRadius: '8px',
          padding: '10px',
          minWidth: '150px',
          boxShadow: seleccionado ? '0 0 10px rgba(0,123,255,0.5)' : 'none',
          backgroundColor: seleccionado ? '#E6F0FF' : '#fff',
          userSelect: 'none',
          transition: 'all 0.2s ease',
        }}
      >
        <strong>{producto.nombreproducto}</strong>
        <div>Código: {producto.codigoproducto}</div>
        {/* Opcional, muestra más info si quieres */}
        {/* <div>Tipo: {producto.tipoproducto}</div> */}
      </div>
    );
  })}
</div>


            {/* Tabla de materias primas */}
            {productoSeleccionado && (
                <>
                    <h3>Materias primas para {productoSeleccionado.nombreproducto}</h3>
                    <table border="1">
                        <thead>
                            <tr>
                                <th>Materia Prima</th>
                                <th>Seleccionar</th>
                                <th>Cantidad Usada</th>
                            </tr>
                        </thead>
                        <tbody>
                            {materiasPaginadas.map((materia) => (
                                <tr key={materia.idmateriaprima}>
                                    <td>{materia.descripcionmateriaprima}</td>
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={materia.seleccionada || false}
                                            onChange={(e) =>
                                                setMateriasPrimas((prev) =>
                                                    prev.map((m) =>
                                                        m.idmateriaprima === materia.idmateriaprima
                                                            ? { ...m, seleccionada: e.target.checked }
                                                            : m
                                                    )
                                                )
                                            }
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            value={materia.cantidadUsada || ''}
                                            onChange={(e) =>
                                                setMateriasPrimas((prev) =>
                                                    prev.map((m) =>
                                                        m.idmateriaprima === materia.idmateriaprima
                                                            ? { ...m, cantidadUsada: Number(e.target.value) }
                                                            : m
                                                    )
                                                )
                                            }
                                            disabled={!materia.seleccionada}
                                            min="1"
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Paginación */}
                    <div>
                        {Array.from(
                            { length: Math.ceil(materiasPrimas.length / materiasPorPagina) },
                            (_, i) => i + 1
                        ).map((pagina) => (
                            <button
                                key={pagina}
                                onClick={() => cambiarPagina(pagina)}
                                disabled={pagina === paginaActual}
                            >
                                {pagina}
                            </button>
                        ))}
                    </div>

                    <button onClick={guardarRelaciones}>Guardar Relaciones</button>
                </>
            )}
        </div>
    );
};

export default Relaciones;
