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
    "x" integer
);


--
-- Name: bbb; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."bbb" (
    "id" integer NOT NULL,
    "x" integer
);


--
-- Name: aaa aaa_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."aaa"
    ADD CONSTRAINT "aaa_pkey" PRIMARY KEY ("id");


--
-- Name: aaa aaa_x_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."aaa"
    ADD CONSTRAINT "aaa_x_key" UNIQUE ("x");


--
-- Name: bbb bbb_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."bbb"
    ADD CONSTRAINT "bbb_pkey" PRIMARY KEY ("id");


--
-- Name: bbb bbb_x_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."bbb"
    ADD CONSTRAINT "bbb_x_key" UNIQUE ("x");


--
-- PostgreSQL database dump complete
--

