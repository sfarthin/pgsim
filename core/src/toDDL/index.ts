import { Schema } from "../toSchema";
import createStmt from "./createStmt";

export default function toDDL(schema: Schema): string {
  return `
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

${schema.tables.map(createStmt)}

--
-- Name: bar bar_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."bar"
    ADD CONSTRAINT "bar_pkey" PRIMARY KEY ("id");


--
-- Name: qux qux_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."qux"
    ADD CONSTRAINT "qux_pkey" PRIMARY KEY ("id");


--
-- PostgreSQL database dump complete
--
    
    `.replace(/^\s+|\s+$/gm, "");
}
