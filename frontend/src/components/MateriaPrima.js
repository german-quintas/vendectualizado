import React, { useState, useEffect } from 'react';
import { getMateriasPrimas, createMateriaPrima, updateMateriaPrima, deleteMateriaPrima } from '../services/api';
import './MateriaPrima.css'; // Agrega los estilos en este archivo

function MateriasPrimas() {
    const [materiasPrimas, setMateriasPrimas] = useState([]);
    const [filteredMaterias, setFilteredMaterias] = useState([]);
    const [newMateria, setNewMateria] = useState({
        codMateriaPrima: '',
        descripcionMateriaPrima: '',
        proveedorMateriaPrima: '',
        precioCostoMateriaPrima: 0,
        unidadMateriaPrima: '',
        cantidadMateriaPrima: 0,
    });
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState(null);
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    useEffect(() => {
        fetchMateriasPrimas();
    }, []);

    useEffect(() => {
        setFilteredMaterias(
            materiasPrimas.filter((materia) =>
                materia.descripcionmateriaprima.toLowerCase().includes(search.toLowerCase())
            )
        );
    }, [search, materiasPrimas]);

    const fetchMateriasPrimas = async () => {
        try {
            const response = await getMateriasPrimas();
            setMateriasPrimas(response.data);
        } catch (error) {
            console.error('Error fetching materias primas:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewMateria({ ...newMateria, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editMode) {
                await updateMateriaPrima(editId, newMateria);
                setEditMode(false);
                setEditId(null);
            } else {
                await createMateriaPrima(newMateria);
            }
            fetchMateriasPrimas();
            setNewMateria({
                codMateriaPrima: '',
                descripcionMateriaPrima: '',
                proveedorMateriaPrima: '',
                precioCostoMateriaPrima: 0,
                unidadMateriaPrima: '',
                cantidadMateriaPrima: 0,
            });
        } catch (error) {
            console.error('Error saving materia prima:', error);
        }
    };

    const handleEdit = (materia) => {
        setEditMode(true);
        setEditId(materia.idmateriaprima);
        setNewMateria({
            codMateriaPrima: materia.codmateriaprima,
            descripcionMateriaPrima: materia.descripcionmateriaprima,
            proveedorMateriaPrima: materia.proveedormateriaprima,
            precioCostoMateriaPrima: materia.preciocostomateriaprima,
            unidadMateriaPrima: materia.unidadmateriaprima,
            cantidadMateriaPrima: materia.cantidadmateriaprima,
        });
    };

    const handleDelete = async (id) => {
        try {
            await deleteMateriaPrima(id);
            fetchMateriasPrimas();
        } catch (error) {
            console.error('Error deleting materia prima:', error);
        }
    };

    const currentData = filteredMaterias.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div>
            <h2>Materias Primas</h2>
            <form onSubmit={handleSubmit} className="materias-primas-form">
    <input name="codMateriaPrima" placeholder="Código" value={newMateria.codMateriaPrima} onChange={handleInputChange} />
    <input name="descripcionMateriaPrima" placeholder="Descripción" value={newMateria.descripcionMateriaPrima} onChange={handleInputChange} />
    <input name="proveedorMateriaPrima" placeholder="Proveedor" value={newMateria.proveedorMateriaPrima} onChange={handleInputChange} />
    <input name="precioCostoMateriaPrima" placeholder="Precio Costo" value={newMateria.precioCostoMateriaPrima} onChange={handleInputChange} />
    <input name="unidadMateriaPrima" placeholder="Unidad" value={newMateria.unidadMateriaPrima} onChange={handleInputChange} />
    <input name="cantidadMateriaPrima" placeholder="Cantidad" value={newMateria.cantidadMateriaPrima} onChange={handleInputChange} />
    <button type="submit" className="materias-primas-button">{editMode ? 'Actualizar' : 'Guardar'}</button>
</form>




            <input
                type="text"
                placeholder="Buscar materia prima..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            <table>
                <thead>
                    <tr>
                        <th>Código</th>
                        <th>Descripción</th>
                        <th>Proveedor</th>
                        <th>Precio Costo</th>
                        <th>Unidad</th>
                        <th>Cantidad</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {currentData.map((materia) => (
                        <tr key={materia.idmateriaprima}>
                            <td>{materia.codmateriaprima}</td>
                            <td>{materia.descripcionmateriaprima}</td>
                            <td>{materia.proveedormateriaprima}</td>
                            <td>{materia.preciocostomateriaprima}</td>
                            <td>{materia.unidadmateriaprima}</td>
                            <td>{materia.cantidadmateriaprima}</td>
                            <td>
                                <button className="materias-primas-edit-button" onClick={() => handleEdit(materia)}>Editar</button>
                                <button className="materias-primas-delete-button" onClick={() => handleDelete(materia.idmateriaprima)}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div>
                {Array.from(
                    { length: Math.ceil(filteredMaterias.length / itemsPerPage) },
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

export default MateriasPrimas;
