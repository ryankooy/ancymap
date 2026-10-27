-- Switch to 'ancestry' database
\c ancestry

INSERT INTO core.region (name, type)
VALUES
    ('England', 0),
    ('Celtic & Gaelic', 0),
    ('Western Europe', 0),
    ('Central & Eastern Europe', 0),
    ('Nordic', 0),
    ('Jewish', 0);

INSERT INTO core.region (macro_id, name, type)
SELECT r.id, 'Southeastern England', 1
FROM core.region AS r WHERE r.name = 'England'
UNION ALL
SELECT r.id, 'Devon & Somerset', 1
FROM core.region AS r WHERE r.name = 'England'
UNION ALL
SELECT r.id, 'West Midlands', 1
FROM core.region AS r WHERE r.name = 'England'
UNION ALL
SELECT r.id, 'East Midlands & Yorkshire', 1
FROM core.region AS r WHERE r.name = 'England'
UNION ALL
SELECT r.id, 'Cornwall', 1
FROM core.region AS r WHERE r.name = 'England'
UNION ALL
SELECT r.id, 'Leinster Ireland', 1
FROM core.region AS r WHERE r.name = 'Celtic & Gaelic'
UNION ALL
SELECT r.id, 'Ulster Ireland', 1
FROM core.region AS r WHERE r.name = 'Celtic & Gaelic'
UNION ALL
SELECT r.id, 'Scottish Lowlands & Central Belt', 1
FROM core.region AS r WHERE r.name = 'Celtic & Gaelic'
UNION ALL
SELECT r.id, 'Northern Wales & North West England', 1
FROM core.region AS r WHERE r.name = 'Celtic & Gaelic'
UNION ALL
SELECT r.id, 'Southern Wales', 1
FROM core.region AS r WHERE r.name = 'Celtic & Gaelic'
UNION ALL
SELECT r.id, 'Belgium', 1
FROM core.region AS r WHERE r.name = 'Western Europe'
UNION ALL
SELECT r.id, 'Bavaria & Western Austria', 1
FROM core.region AS r WHERE r.name = 'Western Europe'
UNION ALL
SELECT r.id, 'France', 1
FROM core.region AS r WHERE r.name = 'Western Europe'
UNION ALL
SELECT r.id, 'The Netherlands', 1
FROM core.region AS r WHERE r.name = 'Western Europe'
UNION ALL
SELECT r.id, 'Northeastern Germany', 1
FROM core.region AS r WHERE r.name = 'Western Europe'
UNION ALL
SELECT r.id, 'Northwestern Germany', 1
FROM core.region AS r WHERE r.name = 'Western Europe'
UNION ALL
SELECT r.id, 'Central & Eastern Poland', 1
FROM core.region AS r WHERE r.name = 'Central & Eastern Europe'
UNION ALL
SELECT r.id, 'East-Central European Lowlands', 1
FROM core.region AS r WHERE r.name = 'Central & Eastern Europe'
UNION ALL
SELECT r.id, 'Lithuania', 1
FROM core.region AS r WHERE r.name = 'Central & Eastern Europe'
UNION ALL
SELECT r.id, 'Denmark', 1
FROM core.region AS r WHERE r.name = 'Nordic'
UNION ALL
SELECT r.id, 'Ashkenazi Jews in Central & Southeastern Europe', 1
FROM core.region AS r WHERE r.name = 'Jewish';

