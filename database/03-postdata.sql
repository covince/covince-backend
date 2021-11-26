--
-- PostgreSQL database dump
--

-- Dumped from database version 13.3
-- Dumped by pg_dump version 13.3

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

\connect covince

--
-- Name: aggregated aggregated_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.aggregated
    ADD CONSTRAINT aggregated_pkey PRIMARY KEY (id);


--
-- Name: knex_migrations_lock knex_migrations_lock_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.knex_migrations_lock
    ADD CONSTRAINT knex_migrations_lock_pkey PRIMARY KEY (index);


--
-- Name: knex_migrations knex_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.knex_migrations
    ADD CONSTRAINT knex_migrations_pkey PRIMARY KEY (id);


--
-- Name: last_updated last_updated_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.last_updated
    ADD CONSTRAINT last_updated_pkey PRIMARY KEY (id);


--
-- Name: aggregated_area_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX aggregated_area_index ON public.aggregated USING btree (area);


--
-- Name: aggregated_count_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX aggregated_count_index ON public.aggregated USING btree (count);


--
-- Name: aggregated_date_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX aggregated_date_index ON public.aggregated USING btree (date);


--
-- Name: aggregated_lineage_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX aggregated_lineage_index ON public.aggregated USING btree (lineage);


--
-- Name: aggregated_pango_clade_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX aggregated_pango_clade_index ON public.aggregated USING btree (pango_clade);


--
-- Name: aggregated_period_count_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX aggregated_period_count_index ON public.aggregated USING btree (period_count);


--
-- PostgreSQL database dump complete
--

