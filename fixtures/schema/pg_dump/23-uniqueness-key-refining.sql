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
    "id" integer NOT NULL
);


--
-- Name: xyz; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."xyz" (
    "id" integer NOT NULL,
    "a" integer,
    "b" character varying(254)
);


--
-- Name: xyz_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE "public"."xyz_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: xyz_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE "public"."xyz_id_seq" OWNED BY "public"."xyz"."id";


--
-- Name: xyz id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."xyz" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."xyz_id_seq"'::"regclass");


--
-- Name: aaa aaa_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."aaa"
    ADD CONSTRAINT "aaa_pkey" PRIMARY KEY ("id");


--
-- Name: xyz key1; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."xyz"
    ADD CONSTRAINT "key1" UNIQUE ("b");


--
-- Name: xyz key2; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."xyz"
    ADD CONSTRAINT "key2" UNIQUE ("b", "a");


--
-- Name: xyz xyz_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."xyz"
    ADD CONSTRAINT "xyz_pkey" PRIMARY KEY ("id");


--
-- Name: xyz a; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."xyz"
    ADD CONSTRAINT "a" FOREIGN KEY ("a") REFERENCES "public"."aaa"("id");


--
-- PostgreSQL database dump complete
--

