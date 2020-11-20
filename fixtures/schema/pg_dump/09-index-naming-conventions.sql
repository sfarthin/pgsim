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
    "id" integer NOT NULL,
    "a" character varying(16) NOT NULL,
    "b" character varying(64) NOT NULL,
    "c" character varying(16) NOT NULL
);


--
-- Name: aaa_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE "public"."aaa_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: aaa_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE "public"."aaa_id_seq" OWNED BY "public"."aaa"."id";


--
-- Name: aaa id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."aaa" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."aaa_id_seq"'::"regclass");


--
-- Name: aaa aaa_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."aaa"
    ADD CONSTRAINT "aaa_pkey" PRIMARY KEY ("id");


--
-- Name: aaa xyz; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."aaa"
    ADD CONSTRAINT "xyz" UNIQUE ("c", "a", "b");


--
-- PostgreSQL database dump complete
--

