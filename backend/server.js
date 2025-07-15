const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Configuración de la conexión a la base de datos
/*const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'gestion_productos',
    password: '1234', // Cambia por tu contraseña
    port: 5432,
});*/

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Endpoint básico para verificar el servidor
app.get('/', (req, res) => {
    res.send('Servidor funcionando correctamente');
});


// Endpoint para obtener las relaciones entre productos y materias primas
app.get('/api/relaciones', async (req, res) => {
    try {
      const query = `
        SELECT p.nombre AS producto, m.descripcion AS materia_prima, r.cantidadusada, m.precio_costo
        FROM producto_materia_prima r
        JOIN productos p ON r.idproducto = p.idproducto
        JOIN materias_primas m ON r.idmateriaprima = m.idmateriaprima;
      `;
      const [result] = await db.execute(query);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener relaciones", error });
    }
  });

  
// Endpoint para calcular precios de los productos
app.get('/api/calcular-precios', async (req, res) => {
    const { margenGanancia, margenCosto } = req.query;  // Recibimos los márgenes del frontend
  
    try {
      // Obtener todos los productos
      const productos = await pool.query('SELECT * FROM producto');
  
      // Iterar sobre cada producto
      for (let i = 0; i < productos.rows.length; i++) {
        const producto = productos.rows[i];
  
        // Aseguramos que los porcentajes sean números
        const costoFijo = parseFloat(producto.directivacostofijoproducto);
        const costoVariable = parseFloat(producto.directivacostovariableproducto);
        const ganancia = parseFloat(producto.directivagananciaproducto);
  
        // Verificar que los márgenes sean números válidos
        if (isNaN(costoFijo) || isNaN(costoVariable) || isNaN(ganancia)) {
          console.error(`Error: Porcentajes inválidos para el producto ${producto.idproducto}:`, producto);
          continue;  // Si hay un error en los porcentajes, saltamos al siguiente producto
        }
  
        // Obtener las materias primas asociadas al producto
        const materiales = await pool.query(
          'SELECT mp.preciocostomateriaprima, ppm.cantidadusada, mp.cantidadmateriaprima FROM producto_materia_prima ppm JOIN materia_prima mp ON ppm.idmateriaprima = mp.idmateriaprima WHERE ppm.idproducto = $1',
          [producto.idproducto]
        );
  
        let precioCosto = 0;
  
        // Calcular el precio costo (sumar todos los costos de las materias primas)
        for (let j = 0; j < materiales.rows.length; j++) {
          const material = materiales.rows[j];
  
          const precioMateriaPrima = parseFloat(material.preciocostomateriaprima);
          const cantidadUsada = parseFloat(material.cantidadusada);
          const cantidadMateriaPrima = parseFloat(material.cantidadmateriaprima);
  
          // Verificar que los valores de las materias primas sean números válidos
          if (isNaN(precioMateriaPrima) || isNaN(cantidadUsada) || isNaN(cantidadMateriaPrima)) {
            console.error(`Error: Valores inválidos para la materia prima ${material.idmateriaprima}:`, material);
            continue;  // Si hay un error en los datos de la materia prima, saltamos al siguiente
          }
  
          // Cálculo del precio costo (multiplicamos el precio por la cantidad usada)
          precioCosto += precioMateriaPrima * (cantidadUsada / cantidadMateriaPrima);
        }
  
        // Verificamos si el precio costo es válido
        if (isNaN(precioCosto) || precioCosto <= 0) {
          console.error(`Error: Precio costo inválido para el producto ${producto.idproducto}:`, precioCosto);
          continue;  // Si el precio costo es inválido, saltamos al siguiente producto
        }
  
        // Calcular el precio de venta usando el precio costo y los márgenes
        const precioVenta = precioCosto * (1 + costoFijo / 100) * (1 + costoVariable / 100) * (1 + ganancia / 100);
  
        // Verificar que el precio de venta es válido
        if (isNaN(precioVenta) || precioVenta <= 0) {
          console.error(`Error: Precio de venta inválido para el producto ${producto.idproducto}:`, precioVenta);
          continue;  // Si el precio de venta es inválido, saltamos al siguiente producto
        }
  
        // Actualizar el precioVenta en la base de datos
        await pool.query(
          'UPDATE producto SET precioventaproducto = $1 WHERE idproducto = $2',
          [precioVenta.toFixed(2), producto.idproducto]
        );
  
        // Calcular el precio sugerido si los márgenes son válidos
        // Calcular el precio sugerido si los márgenes son válidos
let precioSugerido = null;
if (margenGanancia && margenCosto) {
  precioSugerido = precioCosto * (1 + parseFloat(margenCosto)/100) * (1 + parseFloat(margenGanancia)/100);

  // Guardar el precio sugerido en la base de datos
  await pool.query(
    'UPDATE producto SET preciosugerido = $1 WHERE idproducto = $2',
    [precioSugerido.toFixed(2), producto.idproducto]
  );
}


  
        // Agregar precioSugerido a la respuesta si se calcula
        producto.precioSugerido = precioSugerido ? precioSugerido.toFixed(2) : null;
        producto.precioCosto = precioCosto.toFixed(2);
        producto.precioVenta = precioVenta.toFixed(2);
      }
  
      // Reducir los datos: crear una versión más ligera del producto
      const productosReducidos = productos.rows.map(producto => ({
        idproducto: producto.idproducto,
        nombreproducto: producto.nombreproducto,
        precioCosto: producto.precioCosto,
        precioVenta: producto.precioVenta,
        precioSugerido: producto.precioSugerido || "No disponible" // Solo si está disponible
      }));
  
      // Enviar los resultados con los precios calculados
      res.json(productosReducidos);
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Hubo un error al calcular los precios' });
    }
  });
  
  

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

// Obtener todas las materias primas
app.get('/materias-primas', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM materia_prima');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Crear una nueva materia prima
app.post('/materias-primas', async (req, res) => {
    const { codMateriaPrima, descripcionMateriaPrima, proveedorMateriaPrima, precioCostoMateriaPrima, unidadMateriaPrima, cantidadMateriaPrima } = req.body;

    if (!codMateriaPrima || !precioCostoMateriaPrima || !unidadMateriaPrima || !cantidadMateriaPrima) {
        return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    try {
        const query = `
            INSERT INTO materia_prima (codMateriaPrima, descripcionMateriaPrima, proveedorMateriaPrima, precioCostoMateriaPrima, unidadMateriaPrima, cantidadMateriaPrima)
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;
        const values = [codMateriaPrima, descripcionMateriaPrima, proveedorMateriaPrima, precioCostoMateriaPrima, unidadMateriaPrima, cantidadMateriaPrima];
        const result = await pool.query(query, values);
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al crear materia prima:', error);
        res.status(500).json({ error: 'Error al crear materia prima' });
    }
});

// Obtener todos los productos
app.get('/productos', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM producto');
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ error: 'Error al obtener productos' });
    }
});


// Crear un nuevo producto
app.post('/productos', async (req, res) => {
  const {
    codproducto,
    nombreproducto,
    tipoproducto,
    descripcionproducto,
    precioventaproducto,
    directivacostofijoproducto,
    directivacostovariableproducto,
    directivagananciaproducto
  } = req.body;

  console.log("📥 Producto recibido:", req.body);

  // ✅ Validación con los mismos nombres que vienen del frontend
  if (
    !codproducto ||
    !nombreproducto ||
    !tipoproducto ||
    precioventaproducto == null ||
    directivacostofijoproducto == null ||
    directivacostovariableproducto == null ||
    directivagananciaproducto == null
  ) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  try {
    const query = `
      INSERT INTO producto (
        codProducto,
        nombreProducto,
        tipoProducto,
        descripcionProducto,
        precioVentaProducto,
        directivaCostoFijoProducto,
        directivaCostoVariableProducto,
        directivaGananciaProducto
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`;

    const values = [
      codproducto,
      nombreproducto,
      tipoproducto,
      descripcionproducto,
      precioventaproducto,
      directivacostofijoproducto,
      directivacostovariableproducto,
      directivagananciaproducto
    ];

    const result = await pool.query(query, values);
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).json({ error: 'Error al crear producto' });
  }
});



// Vincular producto con materias primas

app.post('/productos/materias-primas', async (req, res) => {
    const relaciones = req.body; // Array de relaciones

    if (!Array.isArray(relaciones)) {
        return res.status(400).json({ message: 'El formato de datos es incorrecto' });
    }

    try {
        const query = `
            INSERT INTO producto_materia_prima (idProducto, idMateriaPrima, cantidadUsada)
            VALUES ($1, $2, $3)
            ON CONFLICT (idProducto, idMateriaPrima)
            DO UPDATE SET cantidadUsada = EXCLUDED.cantidadUsada;
        `;

        // Ejecutar la consulta para cada relación
        for (const relacion of relaciones) {
            const { idProducto, idMateriaPrima, cantidadUsada } = relacion;
            await pool.query(query, [idProducto, idMateriaPrima, cantidadUsada]);
        }

        res.status(201).json({ message: 'Relaciones guardadas con éxito' });
    } catch (error) {
        res.status(500).json({ message: 'Error al guardar relaciones', error });
    }
});


// Obtener materias primas asociadas a un producto
app.get('/productos/:id/materias-primas', async (req, res) => {
    const { id } = req.params;

    try {
        const query = `
            SELECT mp.*, pmp.cantidadUsada
            FROM producto_materia_prima pmp
            JOIN materia_prima mp ON pmp.idMateriaPrima = mp.idMateriaPrima
            WHERE pmp.idProducto = $1`;
        const result = await pool.query(query, [id]);
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener materias primas del producto:', error);
        res.status(500).json({ error: 'Error al obtener materias primas del producto' });
    }
});


// Actualizar una materia prima
app.put('/materias-primas/:id', async (req, res) => {
    const { id } = req.params;
    const { codMateriaPrima, descripcionMateriaPrima, proveedorMateriaPrima, precioCostoMateriaPrima, unidadMateriaPrima, cantidadMateriaPrima } = req.body;

    try {
        const query = `
            UPDATE materia_prima
            SET codMateriaPrima = $1, descripcionMateriaPrima = $2, proveedorMateriaPrima = $3, precioCostoMateriaPrima = $4, unidadMateriaPrima = $5, cantidadMateriaPrima = $6
            WHERE idMateriaPrima = $7 RETURNING *`;
        const values = [codMateriaPrima, descripcionMateriaPrima, proveedorMateriaPrima, precioCostoMateriaPrima, unidadMateriaPrima, cantidadMateriaPrima, id];

        const result = await pool.query(query, values);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Materia prima no encontrada' });
        }
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Eliminar una materia prima
app.delete('/materias-primas/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const query = 'DELETE FROM materia_prima WHERE idMateriaPrima = $1 RETURNING *';
        const values = [id];

        const result = await pool.query(query, values);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Materia prima no encontrada' });
        }
        res.json({ message: 'Materia prima eliminada con éxito', deleted: result.rows[0] });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Actualizar un producto
app.put('/productos/:id', async (req, res) => {
    const { id } = req.params;

    // 👇 Adaptado a las claves en minúsculas que envía el frontend
    const {
        codproducto,
        nombreproducto,
        tipoproducto,
        descripcionproducto,
        precioventaproducto,
        directivacostofijoproducto,
        directivacostovariableproducto,
        directivagananciaproducto
    } = req.body;

    try {
        const query = `
            UPDATE producto
            SET codProducto = $1,
                nombreProducto = $2,
                tipoProducto = $3,
                descripcionProducto = $4,
                precioVentaProducto = $5,
                directivaCostoFijoProducto = $6,
                directivaCostoVariableProducto = $7,
                directivaGananciaProducto = $8
            WHERE idProducto = $9
            RETURNING *`;

        const values = [
            codproducto,
            nombreproducto,
            tipoproducto,
            descripcionproducto,
            precioventaproducto,
            directivacostofijoproducto,
            directivacostovariableproducto,
            directivagananciaproducto,
            id
        ];

        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('❌ Error en PUT /productos/:id:', error.message);
        res.status(500).json({ error: error.message });
    }
});


// Eliminar un producto
app.delete('/productos/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const query = 'DELETE FROM producto WHERE idProducto = $1 RETURNING *';
        const values = [id];

        const result = await pool.query(query, values);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json({ message: 'Producto eliminado con éxito', deleted: result.rows[0] });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Eliminar la relación entre un producto y una materia prima
app.delete('/productos/:idProducto/materias-primas/:idMateriaPrima', async (req, res) => {
    const { idProducto, idMateriaPrima } = req.params;

    try {
        const query = `
            DELETE FROM producto_materia_prima
            WHERE idProducto = $1 AND idMateriaPrima = $2 RETURNING *`;
        const values = [idProducto, idMateriaPrima];

        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Relación no encontrada' });
        }

        res.json({ message: 'Relación eliminada con éxito', deleted: result.rows[0] });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.put('/productos/:idProducto/materias-primas', async (req, res) => {
    const { idProducto } = req.params;
    const { relaciones } = req.body; // Array con { idMateriaPrima, cantidadUsada }

    try {
        await pool.query('BEGIN');

        // Actualizar o insertar relaciones
        for (const { idMateriaPrima, cantidadUsada } of relaciones) {
            await pool.query(
                `INSERT INTO producto_materia_prima (idProducto, idMateriaPrima, cantidadUsada)
                 VALUES ($1, $2, $3)
                 ON CONFLICT (idProducto, idMateriaPrima)
                 DO UPDATE SET cantidadUsada = EXCLUDED.cantidadUsada`,
                [idProducto, idMateriaPrima, cantidadUsada]
            );
        }

        // Eliminar relaciones deseleccionadas
        const idsMateriaPrima = relaciones.map((r) => r.idMateriaPrima);
        await pool.query(
            `DELETE FROM producto_materia_prima
             WHERE idProducto = $1 AND idMateriaPrima NOT IN (${idsMateriaPrima.join(',')})`,
            [idProducto]
        );

        await pool.query('COMMIT');
        res.json({ message: 'Relaciones actualizadas correctamente' });
    } catch (error) {
        await pool.query('ROLLBACK');
        console.error('Error al sincronizar relaciones:', error.message);  // Mensaje de error más claro
        res.status(500).json({ error: error.message || 'Error al sincronizar relaciones' });
    }
});

app.get('/', (req, res) => {
  res.send('Backend funcionando!');
});

app.listen(3000, () => {
  console.log('Servidor corriendo en el puerto 3000');
});

