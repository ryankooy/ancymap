#!/usr/bin/python3

import logging
import numpy
import psycopg2
import psycopg2.extras
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from . import ancydb as db

MIN_OPACITY = 0.2
MAX_OPACITY = 0.8

db_pool = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    global db_pool
    # 1. Startup: Create the connection pool
    db_pool = db.get_db_pool()
    yield
    # 2. Shutdown: Close all connections in the pool cleanly
    if db_pool:
        db_pool.closeall()


app = FastAPI(lifespan=lifespan)

origins = [
    "http://localhost:3000",
    "http://localhost:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

logger = logging.getLogger("uvicorn.error")


class PersonPayload(BaseModel):
    name: str


class ResultsPayload(BaseModel):
    person_id: str
    year: int
    region_percentages: dict


def scale_percentages(data):
    data = numpy.array(list(data))
    mn = data.min()
    mx = data.max()

    if mn == mx:
        return numpy.full_like(data, MIN_OPACITY)

    return MIN_OPACITY + ((data - mn) * (MAX_OPACITY - MIN_OPACITY)) / (mx - mn)


def get_conn():
    global db_pool
    conn = db_pool.getconn()
    psycopg2.extras.register_composite("core.point", conn)
    return conn


def get_regions(conn, person_id):
    regions = []

    logger.info(f"Person id: {person_id}")  # TODO:REMOVE

    for region in db.get_regions_by_person(conn, person_id):
        regions.append(region)

    if not regions:
        logger.info("No results found")
        return []

    region_percents = {r["region"]: r["percentage"] for r in regions}
    scaled_arr = scale_percentages(region_percents.values())
    scaled_percents = {k: scaled_arr[i] for i, k in enumerate(region_percents.keys())}

    for region in regions:
        region["percentage_scaled"] = scaled_percents[region["region"]]

    return regions


@app.get("/")
async def read_root():
    conn = None
    try:
        conn = get_conn()
        people = db.list_people(conn)
        regions = db.list_regions(conn)

        return {"people": people, "regions": regions}

    except psycopg2.DatabaseError as e:
        logger.warn(f"Database error: {e}")

    finally:
        if conn:
            db_pool.putconn(conn)


@app.post("/data/person")
async def add_person(data: PersonPayload):
    conn = None
    try:
        conn = get_conn()
        success = db.insert_person(conn, data.name)

        if success:
            conn.commit()
        else:
            logger.warn("Failed to insert person record")

        return {"success": success}

    except psycopg2.DatabaseError as e:
        logger.warn(f"Database error: {e}")

    finally:
        if conn:
            db_pool.putconn(conn)


@app.delete("/data/person/{person_id}", status_code=status.HTTP_200_OK)
async def remove_person(person_id: str):
    conn = None
    try:
        conn = get_conn()
        success = db.delete_person(conn, person_id)

        if success:
            conn.commit()
        else:
            logger.warn("Failed to delete person")

        return {"success": success}

    except psycopg2.DatabaseError as e:
        logger.warn(f"Database error: {e}")

    finally:
        if conn:
            db_pool.putconn(conn)


@app.get("/data/results")
async def read_person_region_data(personId: str | None = None):
    conn = None
    try:
        conn = get_conn()
        regions = get_regions(conn, personId)

        return {"person": personId, "regions": regions}

    except psycopg2.DatabaseError as e:
        logger.warn(f"Database error: {e}")

    finally:
        if conn:
            db_pool.putconn(conn)


@app.post("/data/results")
async def add_results(data: ResultsPayload):
    conn = None
    try:
        conn = get_conn()
        success = db.insert_results(
            conn, data.person_id, data.year, data.region_percentages
        )

        if success:
            conn.commit()
        else:
            logger.warn("Failed to insert results")
            conn.rollback()

        return {"success": success}

    except psycopg2.DatabaseError as e:
        logger.warn(f"Database error: {e}")

    finally:
        if conn:
            db_pool.putconn(conn)


@app.delete("/data/results/{person_id}/{year}/{region_id}", status_code=status.HTTP_200_OK)
async def remove_result(person_id: str, year: int, region_id: str):
    conn = None
    try:
        conn = get_conn()
        success = db.delete_result(conn, person_id, year, region_id)

        if success:
            conn.commit()
        else:
            logger.warn("Failed to delete result")

        return {"success": success}

    except psycopg2.DatabaseError as e:
        logger.warn(f"Database error: {e}")

    finally:
        if conn:
            db_pool.putconn(conn)


@app.delete("/data/results/{person_id}/{year}", status_code=status.HTTP_200_OK)
async def remove_results(person_id: str, year: int):
    conn = None
    try:
        conn = get_conn()
        success = db.delete_results(conn, person_id, year)

        if success:
            conn.commit()
        else:
            logger.warn("Failed to delete results")

        return {"success": success}

    except psycopg2.DatabaseError as e:
        logger.warn(f"Database error: {e}")

    finally:
        if conn:
            db_pool.putconn(conn)

