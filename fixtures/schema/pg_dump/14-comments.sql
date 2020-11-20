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
    "a" integer,
    "b" integer,
    "c" integer
);


--
-- Name: TABLE "aaa"; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE "public"."aaa" IS 'Its a comment';


--
-- Name: COLUMN "aaa"."c"; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN "public"."aaa"."c" IS 'foo''bar';


--
-- PostgreSQL database dump complete
--

