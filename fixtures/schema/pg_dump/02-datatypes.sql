--
-- PostgreSQL database dump
--

-- Dumped from database version 11.8
-- Dumped by pg_dump version 11.8

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: aaa; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."aaa" (
    "c0" bigint,
    "c1" bigint,
    "c2" bigint NOT NULL,
    "c3" bigint NOT NULL,
    "c4" bit(1),
    "c5" bit(5),
    "c6" bit varying,
    "c7" bit varying,
    "c8" bit varying(5),
    "c9" bit varying(5),
    "c10" boolean,
    "c11" boolean,
    "c12" "box",
    "c13" "bytea",
    "c14" character(1),
    "c15" character(1),
    "c16" character(5),
    "c17" character(5),
    "c18" character varying,
    "c19" character varying,
    "c20" character varying(5),
    "c21" character varying(5),
    "c22" "cidr",
    "c23" "circle",
    "c24" "date",
    "c25" double precision,
    "c26" double precision,
    "c27" "inet",
    "c28" integer,
    "c29" integer,
    "c30" integer,
    "c31" interval,
    "c32" interval(4),
    "c33" "json",
    "c34" "jsonb",
    "c35" "line",
    "c36" "lseg",
    "c37" "macaddr",
    "c38" "money",
    "c39" numeric,
    "c40" numeric,
    "c41" numeric(10,3),
    "c42" numeric(10,3),
    "c43" "path",
    "c44" "pg_lsn",
    "c45" "point",
    "c46" "polygon",
    "c47" real,
    "c48" real,
    "c49" smallint,
    "c50" smallint,
    "c51" smallint NOT NULL,
    "c52" smallint NOT NULL,
    "c53" integer NOT NULL,
    "c54" integer NOT NULL,
    "c55" "text",
    "c56" time without time zone,
    "c57" time(3) without time zone,
    "c58" time with time zone,
    "c59" time(3) with time zone,
    "c60" timestamp without time zone,
    "c61" timestamp(3) without time zone,
    "c62" timestamp with time zone,
    "c63" timestamp(3) with time zone,
    "c64" "tsquery",
    "c65" "tsvector",
    "c66" "txid_snapshot",
    "c67" "uuid",
    "c68" "xml"
);


--
-- Name: aaa_c2_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE "public"."aaa_c2_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: aaa_c2_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE "public"."aaa_c2_seq" OWNED BY "public"."aaa"."c2";


--
-- Name: aaa_c3_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE "public"."aaa_c3_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: aaa_c3_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE "public"."aaa_c3_seq" OWNED BY "public"."aaa"."c3";


--
-- Name: aaa_c51_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE "public"."aaa_c51_seq"
    AS smallint
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: aaa_c51_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE "public"."aaa_c51_seq" OWNED BY "public"."aaa"."c51";


--
-- Name: aaa_c52_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE "public"."aaa_c52_seq"
    AS smallint
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: aaa_c52_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE "public"."aaa_c52_seq" OWNED BY "public"."aaa"."c52";


--
-- Name: aaa_c53_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE "public"."aaa_c53_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: aaa_c53_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE "public"."aaa_c53_seq" OWNED BY "public"."aaa"."c53";


--
-- Name: aaa_c54_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE "public"."aaa_c54_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: aaa_c54_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE "public"."aaa_c54_seq" OWNED BY "public"."aaa"."c54";


--
-- Name: aaa c2; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."aaa" ALTER COLUMN "c2" SET DEFAULT "nextval"('"public"."aaa_c2_seq"'::"regclass");


--
-- Name: aaa c3; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."aaa" ALTER COLUMN "c3" SET DEFAULT "nextval"('"public"."aaa_c3_seq"'::"regclass");


--
-- Name: aaa c51; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."aaa" ALTER COLUMN "c51" SET DEFAULT "nextval"('"public"."aaa_c51_seq"'::"regclass");


--
-- Name: aaa c52; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."aaa" ALTER COLUMN "c52" SET DEFAULT "nextval"('"public"."aaa_c52_seq"'::"regclass");


--
-- Name: aaa c53; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."aaa" ALTER COLUMN "c53" SET DEFAULT "nextval"('"public"."aaa_c53_seq"'::"regclass");


--
-- Name: aaa c54; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."aaa" ALTER COLUMN "c54" SET DEFAULT "nextval"('"public"."aaa_c54_seq"'::"regclass");


--
-- PostgreSQL database dump complete
--

