--
-- PostgreSQL database dump
--

-- Dumped from database version 17.2
-- Dumped by pg_dump version 17.2

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: listadodeproductos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.listadodeproductos (
    id integer NOT NULL,
    id_promocion integer,
    idproducto integer
);


ALTER TABLE public.listadodeproductos OWNER TO postgres;

--
-- Name: listadodeproductos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.listadodeproductos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.listadodeproductos_id_seq OWNER TO postgres;

--
-- Name: listadodeproductos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.listadodeproductos_id_seq OWNED BY public.listadodeproductos.id;


--
-- Name: materia_prima; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.materia_prima (
    idmateriaprima bigint NOT NULL,
    codmateriaprima character varying(100) NOT NULL,
    descripcionmateriaprima text,
    proveedormateriaprima character varying(255),
    preciocostomateriaprima numeric(10,2) NOT NULL,
    unidadmateriaprima character varying(50) NOT NULL,
    cantidadmateriaprima integer NOT NULL
);


ALTER TABLE public.materia_prima OWNER TO postgres;

--
-- Name: materia_prima_idmateriaprima_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.materia_prima_idmateriaprima_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.materia_prima_idmateriaprima_seq OWNER TO postgres;

--
-- Name: materia_prima_idmateriaprima_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.materia_prima_idmateriaprima_seq OWNED BY public.materia_prima.idmateriaprima;


--
-- Name: producto; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.producto (
    idproducto bigint NOT NULL,
    codproducto character varying(100) NOT NULL,
    nombreproducto character varying(255) NOT NULL,
    tipoproducto character varying(100) NOT NULL,
    descripcionproducto text,
    precioventaproducto numeric(10,2) NOT NULL,
    directivacostofijoproducto numeric(5,2) NOT NULL,
    directivacostovariableproducto numeric(5,2) NOT NULL,
    directivagananciaproducto numeric(5,2) NOT NULL,
    imagenproducto character varying(255),
    preciosugerido numeric(12,2)
);


ALTER TABLE public.producto OWNER TO postgres;

--
-- Name: producto_idproducto_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.producto_idproducto_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.producto_idproducto_seq OWNER TO postgres;

--
-- Name: producto_idproducto_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.producto_idproducto_seq OWNED BY public.producto.idproducto;


--
-- Name: producto_materia_prima; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.producto_materia_prima (
    idproductomateriaprima bigint NOT NULL,
    idproducto bigint,
    idmateriaprima bigint,
    cantidadusada numeric(10,2) NOT NULL,
    precio_costo numeric(10,2)
);


ALTER TABLE public.producto_materia_prima OWNER TO postgres;

--
-- Name: producto_materia_prima_idproductomateriaprima_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.producto_materia_prima_idproductomateriaprima_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.producto_materia_prima_idproductomateriaprima_seq OWNER TO postgres;

--
-- Name: producto_materia_prima_idproductomateriaprima_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.producto_materia_prima_idproductomateriaprima_seq OWNED BY public.producto_materia_prima.idproductomateriaprima;


--
-- Name: promocion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.promocion (
    id integer NOT NULL,
    tipo character varying(50),
    nombre_promocion character varying(100),
    porcentaje numeric(5,2),
    precio_con_descuento numeric(10,2),
    precio_sin_descuento numeric(10,2),
    desde date,
    hasta date,
    repeticion character varying(50),
    estado character varying(50),
    CONSTRAINT promocion_estado_check CHECK (((estado)::text = ANY ((ARRAY['activa'::character varying, 'pausada'::character varying, 'desactivada'::character varying, 'finalizada'::character varying])::text[])))
);


ALTER TABLE public.promocion OWNER TO postgres;

--
-- Name: promocion_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.promocion_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.promocion_id_seq OWNER TO postgres;

--
-- Name: promocion_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.promocion_id_seq OWNED BY public.promocion.id;


--
-- Name: listadodeproductos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.listadodeproductos ALTER COLUMN id SET DEFAULT nextval('public.listadodeproductos_id_seq'::regclass);


--
-- Name: materia_prima idmateriaprima; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.materia_prima ALTER COLUMN idmateriaprima SET DEFAULT nextval('public.materia_prima_idmateriaprima_seq'::regclass);


--
-- Name: producto idproducto; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.producto ALTER COLUMN idproducto SET DEFAULT nextval('public.producto_idproducto_seq'::regclass);


--
-- Name: producto_materia_prima idproductomateriaprima; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.producto_materia_prima ALTER COLUMN idproductomateriaprima SET DEFAULT nextval('public.producto_materia_prima_idproductomateriaprima_seq'::regclass);


--
-- Name: promocion id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promocion ALTER COLUMN id SET DEFAULT nextval('public.promocion_id_seq'::regclass);


--
-- Name: listadodeproductos listadodeproductos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.listadodeproductos
    ADD CONSTRAINT listadodeproductos_pkey PRIMARY KEY (id);


--
-- Name: materia_prima materia_prima_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.materia_prima
    ADD CONSTRAINT materia_prima_pkey PRIMARY KEY (idmateriaprima);


--
-- Name: producto_materia_prima producto_materia_prima_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.producto_materia_prima
    ADD CONSTRAINT producto_materia_prima_pkey PRIMARY KEY (idproductomateriaprima);


--
-- Name: producto producto_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.producto
    ADD CONSTRAINT producto_pkey PRIMARY KEY (idproducto);


--
-- Name: promocion promocion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promocion
    ADD CONSTRAINT promocion_pkey PRIMARY KEY (id);


--
-- Name: producto_materia_prima unique_producto_materia; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.producto_materia_prima
    ADD CONSTRAINT unique_producto_materia UNIQUE (idproducto, idmateriaprima);


--
-- Name: listadodeproductos listadodeproductos_id_promocion_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.listadodeproductos
    ADD CONSTRAINT listadodeproductos_id_promocion_fkey FOREIGN KEY (id_promocion) REFERENCES public.promocion(id) ON DELETE CASCADE;


--
-- Name: listadodeproductos listadodeproductos_idproducto_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.listadodeproductos
    ADD CONSTRAINT listadodeproductos_idproducto_fkey FOREIGN KEY (idproducto) REFERENCES public.producto(idproducto) ON DELETE CASCADE;


--
-- Name: producto_materia_prima producto_materia_prima_idmateriaprima_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.producto_materia_prima
    ADD CONSTRAINT producto_materia_prima_idmateriaprima_fkey FOREIGN KEY (idmateriaprima) REFERENCES public.materia_prima(idmateriaprima) ON DELETE CASCADE;


--
-- Name: producto_materia_prima producto_materia_prima_idproducto_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.producto_materia_prima
    ADD CONSTRAINT producto_materia_prima_idproducto_fkey FOREIGN KEY (idproducto) REFERENCES public.producto(idproducto) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

