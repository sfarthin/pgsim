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
-- Name: ccc; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."ccc" (
    "id" integer NOT NULL,
    "a" integer,
    "b" integer
);


--
-- Name: ccc_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE "public"."ccc_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: ccc_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE "public"."ccc_id_seq" OWNED BY "public"."ccc"."id";


--
-- Name: ddd; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."ddd" (
    "id" integer NOT NULL,
    "a" integer,
    "b" integer
);


--
-- Name: ccc id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."ccc" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."ccc_id_seq"'::"regclass");


--
-- Name: aaa aaa_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."aaa"
    ADD CONSTRAINT "aaa_pkey" PRIMARY KEY ("id");


--
-- Name: ccc ccc_a_b_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."ccc"
    ADD CONSTRAINT "ccc_a_b_key" UNIQUE ("a", "b");


--
-- Name: ccc ccc_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."ccc"
    ADD CONSTRAINT "ccc_pkey" PRIMARY KEY ("id");


--
-- Name: ddd ddd_a_b_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."ddd"
    ADD CONSTRAINT "ddd_a_b_key" UNIQUE ("a", "b");


--
-- Name: ddd ddd_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."ddd"
    ADD CONSTRAINT "ddd_pkey" PRIMARY KEY ("id");


--
-- Name: key0; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "key0" ON "public"."ddd" USING "btree" ("a");


--
-- Name: ccc key1; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."ccc"
    ADD CONSTRAINT "key1" FOREIGN KEY ("a") REFERENCES "public"."aaa"("id");


--
-- Name: ddd key1; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."ddd"
    ADD CONSTRAINT "key1" FOREIGN KEY ("a") REFERENCES "public"."aaa"("id");


--
-- Name: ccc key2; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."ccc"
    ADD CONSTRAINT "key2" FOREIGN KEY ("b") REFERENCES "public"."aaa"("id");


--
-- Name: ddd key2; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."ddd"
    ADD CONSTRAINT "key2" FOREIGN KEY ("b") REFERENCES "public"."aaa"("id");


--
-- PostgreSQL database dump complete
--

