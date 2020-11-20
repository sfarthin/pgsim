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
-- Name: foo; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."foo" (
    "user_id" integer
);


--
-- Name: lusers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."lusers" (
    "id" integer NOT NULL
);


--
-- Name: lusers lusers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."lusers"
    ADD CONSTRAINT "lusers_pkey" PRIMARY KEY ("id");


--
-- Name: foo foo_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."foo"
    ADD CONSTRAINT "foo_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."lusers"("id");


--
-- PostgreSQL database dump complete
--

