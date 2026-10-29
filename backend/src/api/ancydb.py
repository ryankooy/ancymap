#!/usr/bin/python3

import psycopg2
import psycopg2.extras
from psycopg2 import sql
from psycopg2.pool import ThreadedConnectionPool


def get_db_pool():
    return ThreadedConnectionPool(
        minconn=5,
        maxconn=20,
        user="postgres",
        host="localhost",
        port="5432",
        database="ancestry",
    )


def run_simple_query(conn, query):
    """Yields dictionary rows with `id` and `name` keys."""
    with conn.cursor() as cur:
        cur.execute(query)

        rows = cur.fetchall()
        for row in rows:
            yield {
                "id": row[0],
                "name": row[1],
            }


def list_people(conn):
    query = sql.SQL("""
        SELECT id, name
        FROM core.person
        ORDER BY name
        """)

    return run_simple_query(conn, query)


def list_regions(conn):
    query = sql.SQL("""
        SELECT id, name
        FROM core.region
        WHERE type = 1 -- Child region
        ORDER BY name
        """)

    return run_simple_query(conn, query)


def get_regions_by_person(conn, person_id):
    with conn.cursor() as cur:
        cur.execute(
            """
            SELECT rg.name, mrg.name, rs.percent, rg.location
            FROM core.result AS rs,
                core.person AS p,
                core.region AS rg,
                core.region AS mrg
            WHERE p.id = %s
                AND p.id = rs.person_id
                AND rg.id = rs.region_id
                AND mrg.id = rg.macro_id
                AND rs.year = 2026
            ORDER BY rs.percent DESC
            """,
            (person_id,),
        )

        rows = cur.fetchall()
        for row in rows:
            yield {
                "region": row[0],
                "macro_region": row[1],
                "percentage": row[2],
                "location": row[3],
            }


def insert_person(conn, person_name) -> bool:
    with conn.cursor() as cur:
        cur.execute(
            """
            INSERT INTO core.person (name)
            VALUES (%s)
            """,
            (person_name,),
        )

        return cur.rowcount > 0


def insert_result(cur, person_id, year, region_id, percent) -> bool:
    cur.execute(
        """
        INSERT INTO core.result (person_id, region_id, year, percent)
        VALUES (%s, %s, %s, %s)
        """,
        (person_id, region_id, year, percent),
    )

    return cur.rowcount > 0


def insert_results(conn, person_id, year, region_percentages) -> bool:
    with conn.cursor() as cur:
        for region_id, percent in region_percentages.items():
            insert_result(cur, person_id, year, region_id, percent)

        return cur.rowcount == len(region_percentages)


def delete_person(conn, person_id) -> bool:
    with conn.cursor() as cur:
        cur.execute(
            """
            DELETE FROM core.person
            WHERE id = %s
            """,
            (person_id,),
        )

        return cur.rowcount > 0


def delete_result(conn, person_id, year, region_id) -> bool:
    with conn.cursor() as cur:
        cur.execute(
            """
            DELETE FROM core.result
            WHERE person_id = %s
                AND year = %s
                AND region_id = %s
            """,
            (person_id, year, region_id),
        )

        return cur.rowcount > 0


def delete_results(conn, person_id, year) -> bool:
    with conn.cursor() as cur:
        cur.execute(
            """
            DELETE FROM core.result
            WHERE person_id = %s AND year = %s
            """,
            (person_id, year),
        )

        return cur.rowcount > 0

