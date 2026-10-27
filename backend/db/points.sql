-- Switch to 'ancestry' database
\c ancestry

UPDATE core.region
SET location = (52.33185247809092, 5.529233387874477)::core.point
WHERE name = 'The Netherlands';

UPDATE core.region
SET location = (51.76668039346659, 0.09503182261944243)::core.point
WHERE name = 'Southeastern England';

UPDATE core.region
SET location = (50.924370314714544, -3.5100103922393022)::core.point
WHERE name = 'Devon & Somerset';

UPDATE core.region
SET location = (52.33592186241388, -1.7874040137107228)::core.point
WHERE name = 'West Midlands';

UPDATE core.region
SET location = (53.78914407873724, -0.6330801518101392)::core.point
WHERE name = 'East Midlands & Yorkshire';

UPDATE core.region
SET location = (50.18607282758634, -5.090546141610868)::core.point
WHERE name = 'Cornwall';

UPDATE core.region
SET location = (53.1389632064021, -6.813152520139408)::core.point
WHERE name = 'Leinster Ireland';

UPDATE core.region
SET location = (54.68749074000269, -6.724358376916289)::core.point
WHERE name = 'Ulster Ireland';

UPDATE core.region
SET location = (55.74172204011724, -3.9717399369995077)::core.point
WHERE name = 'Scottish Lowlands & Central Belt';

UPDATE core.region
SET location = (52.97018059802343, -3.3501809344376565)::core.point
WHERE name = 'Northern Wales & North West England';

UPDATE core.region
SET location = (51.931918734673104, -3.865186965131757)::core.point
WHERE name = 'Southern Wales';

UPDATE core.region
SET location = (50.75685631785517, 4.676809612932593)::core.point
WHERE name = 'Belgium';

UPDATE core.region
SET location = (48.45650245576854, 11.407405669245385)::core.point
WHERE name = 'Bavaria & Western Austria';

UPDATE core.region
SET location = (47.09684459670192, 2.4036795464209693)::core.point
WHERE name = 'France';

UPDATE core.region
SET location = (52.84500302201662, 13.360876820154317)::core.point
WHERE name = 'Northeastern Germany';

UPDATE core.region
SET location = (52.50109311100095, 8.832375515775063)::core.point
WHERE name = 'Northwestern Germany';

UPDATE core.region
SET location = (52.393531257736484, 20.78406719360735)::core.point
WHERE name = 'Central & Eastern Poland';

UPDATE core.region
SET location = (51.14144903156395, 28.899851884200775)::core.point
WHERE name = 'East-Central European Lowlands';

UPDATE core.region
SET location = (55.467096754212015, 23.76755040590428)::core.point
WHERE name = 'Lithuania';

UPDATE core.region
SET location = (56.305547499357694, 9.365140375113734)::core.point
WHERE name = 'Denmark';

UPDATE core.region
SET location = (46.14133009797958, 24.389312688806232)::core.point
WHERE name = 'Ashkenazi Jews in Central & Southeastern Europe';

