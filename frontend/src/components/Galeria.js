import React, { useState, useEffect } from "react";
import Slider from "react-slick";

function Galeria() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [mostrarSugerido, setMostrarSugerido] = useState(false);

  const fetchProductos = async () => {
    try {
      const response = await fetch("http://localhost:3001/productos");
      if (!response.ok) {
        throw new Error("Error al obtener los productos");
      }
      const data = await response.json();
      setProductos(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  if (cargando) {
    return <p style={estiloCargando}>Cargando productos...</p>;
  }

  if (error) {
    return <p style={estiloError}>Error: {error}</p>;
  }

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    centerMode: false,
    focusOnSelect: true,
    prevArrow: null,
    nextArrow: null,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  return (
    <div style={contenedorEstilo}>
      <h2 style={tituloEstilo}>MENÚ DE HOY</h2>

      {/* Aquí agrego estilos para toggle inline */}
      <style>{`
        .switchLabel {
          position: relative;
          display: inline-block;
          width: 50px;
          height: 26px;
        }
        .switchLabel input {
          opacity: 0;
          width: 0;
          height: 0;
          position: absolute;
        }
        .sliderSwitch {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #ccc;
          border-radius: 26px;
          transition: 0.4s;
        }
        .sliderSwitch::before {
          position: absolute;
          content: "";
          height: 22px;
          width: 22px;
          left: 2px;
          bottom: 2px;
          background-color: white;
          border-radius: 50%;
          transition: 0.4s;
        }
        .switchLabel input:checked + .sliderSwitch {
          background-color: #4caf50;
        }
        .switchLabel input:checked + .sliderSwitch::before {
          transform: translateX(24px);
        }
      `}</style>

      {/* Switch para seleccionar tipo de precio */}
      <div style={switchContainer}>
        <label style={labelPrecio}>Precio de Venta</label>
        <label className="switchLabel">
          <input
            type="checkbox"
            checked={mostrarSugerido}
            onChange={() => setMostrarSugerido(!mostrarSugerido)}
          />
          <span className="sliderSwitch"></span>
        </label>
        <label style={labelPrecio}>Precio Sugerido</label>
      </div>

      <Slider {...settings}>
        {productos.map((producto) => (
          <div key={producto.idproducto} style={productoEstilo}>
            <img
              src={`/images/${producto.imagenproducto}`}
              alt={producto.nombreproducto}
              style={imagenEstilo}
            />
            <h3 style={nombreEstilo}>{producto.nombreproducto}</h3>
            <p style={descripcionEstilo}>{producto.descripcionproducto}</p>
            <p style={precioEstilo}>
              $
              {mostrarSugerido && producto.preciosugerido
                ? producto.preciosugerido
                : producto.precioventaproducto}
            </p>
            <p style={precioInfoEstilo}>
              {mostrarSugerido ? "Precio sugerido" : "Precio de venta"}
            </p>
          </div>
        ))}
      </Slider>
    </div>
  );
}

// Tus estilos originales (sin tocar el toggle)

const contenedorEstilo = {
  backgroundColor: "#f9f9f9",
  padding: "20px",
  borderRadius: "10px",
  boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
  maxWidth: "1200px",
  margin: "auto",
};

const tituloEstilo = {
  textAlign: "center",
  fontSize: "2rem",
  color: "#333",
  marginBottom: "20px",
  fontFamily: "'Roboto', sans-serif",
  fontWeight: "bold",
};

const switchContainer = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "15px",
  marginBottom: "20px",
  fontFamily: "'Roboto', sans-serif",
};

const labelPrecio = {
  fontSize: "1rem",
  fontWeight: "bold",
  color: "#444",
};

const productoEstilo = {
  backgroundColor: "#fff",
  borderRadius: "15px",
  padding: "15px",
  textAlign: "center",
  margin: "10px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  transition: "transform 0.3s, box-shadow 0.3s",
};

const imagenEstilo = {
  width: "100%",
  height: "200px",
  objectFit: "cover",
  borderRadius: "10px",
  marginBottom: "10px",
};

const nombreEstilo = {
  color: "#444",
  fontSize: "1.25rem",
  margin: "10px 0",
  fontFamily: "'Roboto', sans-serif",
};

const descripcionEstilo = {
  color: "#666",
  fontSize: "1rem",
  margin: "10px 0",
  fontFamily: "'Roboto', sans-serif",
};

const precioEstilo = {
  color: "#D00000",
  fontSize: "1.75rem",
  fontWeight: "bold",
  marginTop: "15px",
};

const precioInfoEstilo = {
  fontSize: "0.9rem",
  color: "#888",
  marginTop: "5px",
  fontFamily: "'Roboto', sans-serif",
};

const estiloCargando = {
  textAlign: "center",
  fontSize: "1.25rem",
  color: "#333",
};

const estiloError = {
  textAlign: "center",
  fontSize: "1.25rem",
  color: "#d9534f",
};

export default Galeria;
