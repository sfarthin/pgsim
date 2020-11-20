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
    "id" bigint NOT NULL,
    "user_id" integer NOT NULL
);


--
-- Name: aaa_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE "public"."aaa_id_seq"
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
-- Name: lusers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."lusers" (
    "id" integer NOT NULL
);


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
-- Name: lusers lusers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."lusers"
    ADD CONSTRAINT "lusers_pkey" PRIMARY KEY ("id");


--
-- Name: aaa xyz; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."aaa"
    ADD CONSTRAINT "xyz" UNIQUE ("user_id");


--
-- Name: aaa_user_id_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "aaa_user_id_idx" ON "public"."aaa" USING "btree" ("user_id");


--
-- Name: aaa aaa_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."aaa"
    ADD CONSTRAINT "aaa_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."lusers"("id");


--
-- PostgreSQL database dump complete
--

