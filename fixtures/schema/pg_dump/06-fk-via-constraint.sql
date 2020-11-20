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
-- Name: bar; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."bar" (
    "user_id" integer
);


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
-- Name: qux; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."qux" (
    "user_id" integer
);


--
-- Name: lusers lusers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."lusers"
    ADD CONSTRAINT "lusers_pkey" PRIMARY KEY ("id");


--
-- Name: foo abc; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."foo"
    ADD CONSTRAINT "abc" FOREIGN KEY ("user_id") REFERENCES "public"."lusers"("id");


--
-- Name: qux bar; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."qux"
    ADD CONSTRAINT "bar" FOREIGN KEY ("user_id") REFERENCES "public"."lusers"("id");


--
-- Name: qux foo; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."qux"
    ADD CONSTRAINT "foo" FOREIGN KEY ("user_id") REFERENCES "public"."lusers"("id");


--
-- Name: bar klm; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."bar"
    ADD CONSTRAINT "klm" FOREIGN KEY ("user_id") REFERENCES "public"."lusers"("id");


--
-- Name: bar pqr; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."bar"
    ADD CONSTRAINT "pqr" FOREIGN KEY ("user_id") REFERENCES "public"."lusers"("id");


--
-- Name: bar xyz; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."bar"
    ADD CONSTRAINT "xyz" FOREIGN KEY ("user_id") REFERENCES "public"."lusers"("id");


--
-- PostgreSQL database dump complete
--

