-- =====================================================================
-- schema.sql
-- Full database structure for the CUSAT Physics website (PostgreSQL)
--
-- This file ONLY defines tables — no data.
-- Run this once to set up (or reset) the database structure.
-- New pages should add their tables here, grouped in their own section.
-- =====================================================================

BEGIN;

-- ---------------------------------------------------------------------
-- HOMEPAGE TABLES
-- ---------------------------------------------------------------------

-- Generic text sections on the home page (hero, vision, facilities blurb, etc.)
DROP TABLE IF EXISTS page_content CASCADE;
CREATE TABLE page_content (
    id             SERIAL PRIMARY KEY,
    section_key    VARCHAR(64) NOT NULL UNIQUE,
    title          VARCHAR(255),
    body           TEXT,
    display_order  INTEGER NOT NULL DEFAULT 0
);

-- Courses offered (MSc, PhD, ...)
DROP TABLE IF EXISTS courses CASCADE;
CREATE TABLE courses (
    id             SERIAL PRIMARY KEY,
    name           VARCHAR(128) NOT NULL,
    display_order  INTEGER NOT NULL DEFAULT 0
);

-- Partner universities / institutions mentioned on the homepage
DROP TABLE IF EXISTS collaborating_institutions CASCADE;
CREATE TABLE collaborating_institutions (
    id                SERIAL PRIMARY KEY,
    institution_name  VARCHAR(128) NOT NULL
);

-- Alumni / student testimonials
DROP TABLE IF EXISTS testimonials CASCADE;
CREATE TABLE testimonials (
    id                  SERIAL PRIMARY KEY,
    author_name         VARCHAR(128) NOT NULL,
    author_designation  VARCHAR(255),
    quote               TEXT NOT NULL,
    display_order       INTEGER NOT NULL DEFAULT 0
);

-- ---------------------------------------------------------------------
-- RESEARCH / LABS TABLES  (add here once you build that page)
-- ---------------------------------------------------------------------
-- DROP TABLE IF EXISTS research_labs CASCADE;
-- CREATE TABLE research_labs (
--     id             SERIAL PRIMARY KEY,
--     name           VARCHAR(255) NOT NULL,
--     focus_area     VARCHAR(255),
--     description    TEXT,
--     display_order  INTEGER NOT NULL DEFAULT 0
-- );

-- ---------------------------------------------------------------------
-- FACILITIES TABLES  (add here once you build that page)
-- ---------------------------------------------------------------------
-- DROP TABLE IF EXISTS facilities CASCADE;
-- CREATE TABLE facilities (
--     id             SERIAL PRIMARY KEY,
--     name           VARCHAR(255) NOT NULL,
--     description    TEXT,
--     display_order  INTEGER NOT NULL DEFAULT 0
-- );

-- ---------------------------------------------------------------------
-- ABOUT PAGE TABLES  (add here later)
-- ---------------------------------------------------------------------

-- ---------------------------------------------------------------------
-- ADMISSIONS PAGE TABLES  (add here later)
-- ---------------------------------------------------------------------

-- ---------------------------------------------------------------------
-- CONTACT PAGE TABLES  (add here later)
-- ---------------------------------------------------------------------

COMMIT;