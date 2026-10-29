CREATE DATABASE ancestry;

-- Switch to 'ancestry' database
\c ancestry

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- DROP SCHEMA IF EXISTS core CASCADE;
CREATE SCHEMA core;

CREATE TYPE core.point AS (
    x double precision,
    y double precision
);

CREATE TABLE core.person (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    name text NOT NULL UNIQUE
);

CREATE TABLE core.region (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    macro_id uuid REFERENCES core.region(id),
    type int NOT NULL,
    name text NOT NULL UNIQUE,
    location core.point
);

CREATE TABLE core.result (
    person_id uuid NOT NULL,
    region_id uuid NOT NULL,
    year int NOT NULL,
    percent int NOT NULL,

    CONSTRAINT unique_result
        UNIQUE (person_id, region_id, year),
    CONSTRAINT fk_result_person
        FOREIGN KEY (person_id)
        REFERENCES core.person(id),
    CONSTRAINT fk_result_region
        FOREIGN KEY (region_id)
        REFERENCES core.region(id)
);
