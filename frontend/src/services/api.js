import axios from 'axios';
const API_BASE_URL = process.env.REACT_APP_API_URL;
console.log("🌐 API_BASE_URL:", API_BASE_URL);


// Materias Primas
export const getMateriasPrimas = () => axios.get(`${API_BASE_URL}/materias-primas`);
export const createMateriaPrima = (data) => axios.post(`${API_BASE_URL}/materias-primas`, data);
export const updateMateriaPrima = (id, data) => axios.put(`${API_BASE_URL}/materias-primas/${id}`, data);
export const deleteMateriaPrima = (id) => axios.delete(`${API_BASE_URL}/materias-primas/${id}`);

// Productos
export const getProductos = () => axios.get(`${API_BASE_URL}/productos`);
export const createProducto = (data) => axios.post(`${API_BASE_URL}/productos`, data);
export const updateProducto = (id, data) => axios.put(`${API_BASE_URL}/productos/${id}`, data); // Nuevo método
export const deleteProducto = (id) => axios.delete(`${API_BASE_URL}/productos/${id}`); // Nuevo método

// Relaciones Producto - Materias Primas
export const relateProductoMateriaPrima = (idProducto, data) =>
    axios.post(`${API_BASE_URL}/productos/${idProducto}/materias-primas`, data);
export const deleteRelacion = (idProducto, idMateriaPrima) =>
    axios.delete(`${API_BASE_URL}/productos/${idProducto}/materias-primas/${idMateriaPrima}`);

