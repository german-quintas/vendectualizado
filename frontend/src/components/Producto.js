import React, { useState, useEffect } from 'react';
import { getProductos, createProducto, updateProducto, deleteProducto } from '../services/api';
import './MateriaPrima.css'; // Usamos los estilos de Materia Prima CSS

const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "productos_preset"); // preset creado en Cloudinary
  formData.append("cloud_name", "dltzftuar"); // ⚠️ reemplazar por el tuyo

  try {
    const res = await fetch("https://api.cloudinary.com/v1_1/dltzftuar/image/upload", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    return data.secure_url;
  } catch (error) {
    console.error("❌ Error subiendo imagen a Cloudinary", error);
    return null;
  }
};

function Productos() {
    const [productos, setProductos] = useState([]);
    const [filteredProductos, setFilteredProductos] = useState([]);
    const [newProducto, setNewProducto] = useState({
        codProducto: '',
        nombreProducto: '',
        tipoProducto: '',
        descripcionProducto: '',
        precioVentaProducto: 1,
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
    console.log("📦 Enviando a backend:", newProducto);

    // ✅ Usar imagen anterior si no se sube una nueva
    let imagenUrl = newProducto.imagenproducto || '';

    // ✅ Subir imagen nueva si se cargó una
    if (newProducto.imagenFile) {
      imagenUrl = await uploadImage(newProducto.imagenFile);
    }

    const payload = {
      codproducto: newProducto.codProducto,
      nombreproducto: newProducto.nombreProducto,
      tipoproducto: newProducto.tipoProducto,
      descripcionproducto: newProducto.descripcionProducto,
      precioventaproducto: Number(newProducto.precioVentaProducto) || 1,
      directivacostofijoproducto: Number(newProducto.directivaCostoFijoProducto),
      directivacostovariableproducto: Number(newProducto.directivaCostoVariableProducto),
      directivagananciaproducto: Number(newProducto.directivaGananciaProducto),
      imagenproducto: imagenUrl,
    };

    if (editMode) {
      await updateProducto(editId, payload);
      setEditMode(false);
      setEditId(null);
    } else {
      console.log("✅ Payload que se envía al backend:", payload);
      await createProducto(payload);
    }

    await fetchProductos();
    setNewProducto({
      codProducto: '',
      nombreProducto: '',
      tipoProducto: '',
      descripcionProducto: '',
      precioVentaProducto: 1,
      directivaCostoFijoProducto: 0,
      directivaCostoVariableProducto: 0,
      directivaGananciaProducto: 0,
      imagenFile: null,
      imagenproducto: '', // ← limpiar también la URL
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
    imagenFile: null, // ← se carga nueva si se selecciona
    imagenproducto: producto.imagenproducto || '', // ✅ agregar URL actual
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
    <label>Código</label>
    <input name="codProducto" placeholder="Código" value={newProducto.codProducto} onChange={handleInputChange} />

    <label>Nombre</label>
    <input name="nombreProducto" placeholder="Nombre" value={newProducto.nombreProducto} onChange={handleInputChange} />

    <label>Tipo</label>
    <input name="tipoProducto" placeholder="Tipo" value={newProducto.tipoProducto} onChange={handleInputChange} />

    <label>Descripción</label>
    <input name="descripcionProducto" placeholder="Descripción" value={newProducto.descripcionProducto} onChange={handleInputChange} />

    {/* precioVentaProducto oculto al usuario */}

    <label>Costo Fijo ($)</label>
    <input
        name="directivaCostoFijoProducto"
        value={newProducto.directivaCostoFijoProducto}
        onChange={handleInputChange}
        type="number"
        step="0.01"
        min="0"
    />

    <label>Costo Variable ($)</label>
    <input
        name="directivaCostoVariableProducto"
        value={newProducto.directivaCostoVariableProducto}
        onChange={handleInputChange}
        type="number"
        step="0.01"
        min="0"
    />

    <label>Ganancia Deseada (%)</label>
    <input
        name="directivaGananciaProducto"
        value={newProducto.directivaGananciaProducto}
        onChange={handleInputChange}
        type="number"
        step="0.01"
        min="0"
    />
    <label>Imagen del producto</label>
        <input
        type="file"
        accept="image/*"
        onChange={(e) => setNewProducto({ ...newProducto, imagenFile: e.target.files[0] })}
        />


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
