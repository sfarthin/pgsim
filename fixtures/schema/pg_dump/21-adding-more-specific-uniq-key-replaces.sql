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
    "a" character varying(16) NOT NULL,
    "b" integer NOT NULL,
    "c" character varying(254) DEFAULT NULL::character varying
);


--
-- Name: aaa aaa_a_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."aaa"
    ADD CONSTRAINT "aaa_a_key" UNIQUE ("a");


--
-- Name: aaa aaa_c_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."aaa"
    ADD CONSTRAINT "aaa_c_key" UNIQUE ("c");


--
-- Name: key3; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "key3" ON "public"."aaa" USING "btree" ("a", "b");


--
-- PostgreSQL database dump complete
--

