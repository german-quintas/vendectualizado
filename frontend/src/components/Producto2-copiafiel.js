import React, { useState, useEffect } from 'react';
import { getProductos, createProducto, updateProducto, deleteProducto } from '../services/api';
import './MateriaPrima.css'; // Usamos los estilos de Materia Prima CSS

function Productos() {
    const [productos, setProductos] = useState([]);
    const [filteredProductos, setFilteredProductos] = useState([]);
    const [newProducto, setNewProducto] = useState({
        codProducto: '',
        nombreProducto: '',
        tipoProducto: '',
        descripcionProducto: '',
        precioVentaProducto: 0,
        directivaCostoFijoProducto: 0,
        directivaCostoVariableProducto: 0,
        directivaGananciaProducto: 0,
    });
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState(null);
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    useEffect(() => {
        fetchProductos();
    }, []);

    useEffect(() => {
        setFilteredProductos(
            productos.filter((producto) =>
                producto.nombreproducto.toLowerCase().includes(search.toLowerCase())
            )
        );
    }, [search, productos]);

    const fetchProductos = async () => {
        try {
            const response = await getProductos();
            setProductos(response.data);
        } catch (error) {
            console.error('Error fetching productos:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewProducto({ ...newProducto, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editMode) {
                await updateProducto(editId, newProducto);
                setEditMode(false);
                setEditId(null);
            } else {
                await createProducto(newProducto);
            }
            fetchProductos();
            setNewProducto({
                codProducto: '',
                nombreProducto: '',
                tipoProducto: '',
                descripcionProducto: '',
                precioVentaProducto: 0,
                directivaCostoFijoProducto: 0,
                directivaCostoVariableProducto: 0,
                directivaGananciaProducto: 0,
            });
        } catch (error) {
            console.error('Error saving producto:', error);
        }
    };

    const handleEdit = (producto) => {
        setEditMode(true);
        setEditId(producto.idproducto);
        setNewProducto({
            codProducto: producto.codproducto,
            nombreProducto: producto.nombreproducto,
            tipoProducto: producto.tipoproducto,
            descripcionProducto: producto.descripcionproducto,
            precioVentaProducto: producto.precioventaproducto,
            directivaCostoFijoProducto: producto.directivacostofijoproducto,
            directivaCostoVariableProducto: producto.directivacostovariableproducto,
            directivaGananciaProducto: producto.directivagananciaproducto,
        });
    };

    const handleDelete = async (id) => {
        try {
            await deleteProducto(id);
            fetchProductos();
        } catch (error) {
            console.error('Error deleting producto:', error);
        }
    };

    const currentData = filteredProductos.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="materias-primas-container">
            <h2>Productos</h2>
            <form onSubmit={handleSubmit} className="materias-primas-form">
                <input name="codProducto" placeholder="Código" value={newProducto.codProducto} onChange={handleInputChange} />
                <input name="nombreProducto" placeholder="Nombre" value={newProducto.nombreProducto} onChange={handleInputChange} />
                <input name="tipoProducto" placeholder="Tipo" value={newProducto.tipoProducto} onChange={handleInputChange} />
                <input name="descripcionProducto" placeholder="Descripción" value={newProducto.descripcionProducto} onChange={handleInputChange} />
                <input name="precioVentaProducto" placeholder="Precio Venta" value={newProducto.precioVentaProducto} onChange={handleInputChange} />
                <input name="directivaCostoFijoProducto" placeholder="Costo Fijo" value={newProducto.directivaCostoFijoProducto} onChange={handleInputChange} />
                <input name="directivaCostoVariableProducto" placeholder="Costo Variable" value={newProducto.directivaCostoVariableProducto} onChange={handleInputChange} />
                <input name="directivaGananciaProducto" placeholder="Ganancia" value={newProducto.directivaGananciaProducto} onChange={handleInputChange} />
                <button type="submit" className="materias-primas-button">{editMode ? 'Actualizar' : 'Guardar'}</button>
            </form>

            <input
                type="text"
                placeholder="Buscar producto..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="materias-primas-search"
            />

            <table className="materias-primas-table">
                <thead>
                    <tr>
                        <th>Código</th>
                        <th>Nombre</th>
                        <th>Tipo</th>
                        <th>Descripción</th>
                        <th>Precio Venta</th>
                        <th>Costo Fijo</th>
                        <th>Costo Variable</th>
                        <th>Ganancia</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {currentData.map((producto) => (
                        <tr key={producto.idproducto}>
                            <td>{producto.codproducto}</td>
                            <td>{producto.nombreproducto}</td>
                            <td>{producto.tipoproducto}</td>
                            <td>{producto.descripcionproducto}</td>
                            <td>{producto.precioventaproducto}</td>
                            <td>{producto.directivacostofijoproducto}</td>
                            <td>{producto.directivacostovariableproducto}</td>
                            <td>{producto.directivagananciaproducto}</td>
                            <td>
                                <button className="materias-primas-edit-button" onClick={() => handleEdit(producto)}>Editar</button>
                                <button className="materias-primas-delete-button" onClick={() => handleDelete(producto.idproducto)}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div>
                {Array.from(
                    { length: Math.ceil(filteredProductos.length / itemsPerPage) },
                    (_, index) => (
                        <button key={index} onClick={() => setCurrentPage(index + 1)}>
                            {index + 1}
                        </button>
                    )
                )}
            </div>
        </div>
    );
}

export default Productos;
