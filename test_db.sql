--
-- PostgreSQL database dump
--

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

--
-- Name: doings_id_seq; Type: SEQUENCE; Schema: public; Owner: seb
--

CREATE SEQUENCE doings_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE doings_id_seq OWNER TO seb;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: doings; Type: TABLE; Schema: public; Owner: seb; Tablespace: 
--

CREATE TABLE doings (
    id integer DEFAULT nextval('doings_id_seq'::regclass) NOT NULL,
    date text NOT NULL,
    habit integer NOT NULL,
    value integer NOT NULL
);


ALTER TABLE doings OWNER TO seb;

--
-- Name: habit_types; Type: TABLE; Schema: public; Owner: seb; Tablespace: 
--

CREATE TABLE habit_types (
    id integer NOT NULL,
    name text NOT NULL
);


ALTER TABLE habit_types OWNER TO seb;

--
-- Name: habits_id_seq; Type: SEQUENCE; Schema: public; Owner: seb
--

CREATE SEQUENCE habits_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE habits_id_seq OWNER TO seb;

--
-- Name: habits; Type: TABLE; Schema: public; Owner: seb; Tablespace: 
--

CREATE TABLE habits (
    id integer DEFAULT nextval('habits_id_seq'::regclass) NOT NULL,
    name text NOT NULL,
    type integer NOT NULL
);


ALTER TABLE habits OWNER TO seb;

--
-- Data for Name: doings; Type: TABLE DATA; Schema: public; Owner: seb
--

COPY doings (id, date, habit, value) FROM stdin;
79	2015-12-29	1	100
80	2015-12-29	2	2500
82	2015-12-29	188	200
84	2015-12-29	194	1
85	2015-12-29	195	1
86	2015-12-29	197	500
88	2015-12-29	189	1
89	2015-12-29	199	1
35	2015-12-24	2	1200
36	2015-12-23	194	1
38	2015-12-24	1	500
42	2015-12-28	1	10
43	2015-12-28	189	1
46	2015-12-28	2	3600
47	2015-12-28	3	1800
37	2015-12-26	195	1
45	2015-12-28	195	1
\.


--
-- Name: doings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: seb
--

SELECT pg_catalog.setval('doings_id_seq', 89, true);


--
-- Data for Name: habit_types; Type: TABLE DATA; Schema: public; Owner: seb
--

COPY habit_types (id, name) FROM stdin;
1	How long?
2	How many?
3	Did you do it?
\.


--
-- Data for Name: habits; Type: TABLE DATA; Schema: public; Owner: seb
--

COPY habits (id, name, type) FROM stdin;
1	push-ups	2
2	running	1
3	reading	1
188	pull-ups	2
189	drink 2L water	3
194	meditate	3
195	Anki	3
197	journaling	1
199	catch a turkey	3
\.


--
-- Name: habits_id_seq; Type: SEQUENCE SET; Schema: public; Owner: seb
--

SELECT pg_catalog.setval('habits_id_seq', 199, true);


--
-- Name: date_habit_unique; Type: CONSTRAINT; Schema: public; Owner: seb; Tablespace: 
--

ALTER TABLE ONLY doings
    ADD CONSTRAINT date_habit_unique UNIQUE (date, habit);


--
-- Name: doings_pkey; Type: CONSTRAINT; Schema: public; Owner: seb; Tablespace: 
--

ALTER TABLE ONLY doings
    ADD CONSTRAINT doings_pkey PRIMARY KEY (id);


--
-- Name: habit_types_pkey; Type: CONSTRAINT; Schema: public; Owner: seb; Tablespace: 
--

ALTER TABLE ONLY habit_types
    ADD CONSTRAINT habit_types_pkey PRIMARY KEY (id);


--
-- Name: habits_name_key; Type: CONSTRAINT; Schema: public; Owner: seb; Tablespace: 
--

ALTER TABLE ONLY habits
    ADD CONSTRAINT habits_name_key UNIQUE (name);


--
-- Name: habits_pkey; Type: CONSTRAINT; Schema: public; Owner: seb; Tablespace: 
--

ALTER TABLE ONLY habits
    ADD CONSTRAINT habits_pkey PRIMARY KEY (id);


--
-- Name: doings_habit_fkey; Type: FK CONSTRAINT; Schema: public; Owner: seb
--

ALTER TABLE ONLY doings
    ADD CONSTRAINT doings_habit_fkey FOREIGN KEY (habit) REFERENCES habits(id);


--
-- Name: public; Type: ACL; Schema: -; Owner: seb
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM seb;
GRANT ALL ON SCHEMA public TO seb;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

