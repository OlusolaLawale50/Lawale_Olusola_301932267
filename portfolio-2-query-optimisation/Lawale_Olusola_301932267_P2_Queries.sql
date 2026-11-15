-- Show related vaccination_records, patients, clinics, vaccines records (up to 20).
SELECT t0."vaccination_id" AS "vaccination_records_vaccination_id",
       t0."vaccination_date" AS "vaccination_records_vaccination_date",
       t1."patient_id" AS "patients_patient_id",
       t1."given_name" AS "patients_given_name",
       t2."clinic_id" AS "clinics_clinic_id",
       t2."clinic_name" AS "clinics_clinic_name",
       t3."vaccine_id" AS "vaccines_vaccine_id",
       t3."vaccine_name" AS "vaccines_vaccine_name"
FROM portfolio."vaccination_records" t0
JOIN portfolio."patients" t1 ON t0."patient_id" = t1."patient_id"
JOIN portfolio."clinics" t2 ON t0."clinic_id" = t2."clinic_id"
JOIN portfolio."vaccines" t3 ON t0."vaccine_id" = t3."vaccine_id"
ORDER BY t0."vaccination_id", t1."patient_id", t2."clinic_id", t3."vaccine_id"
LIMIT 20;

EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON)
SELECT t0."vaccination_id" AS "vaccination_records_vaccination_id",
       t0."vaccination_date" AS "vaccination_records_vaccination_date",
       t1."patient_id" AS "patients_patient_id",
       t1."given_name" AS "patients_given_name",
       t2."clinic_id" AS "clinics_clinic_id",
       t2."clinic_name" AS "clinics_clinic_name",
       t3."vaccine_id" AS "vaccines_vaccine_id",
       t3."vaccine_name" AS "vaccines_vaccine_name"
FROM portfolio."vaccination_records" t0
JOIN portfolio."patients" t1 ON t0."patient_id" = t1."patient_id"
JOIN portfolio."clinics" t2 ON t0."clinic_id" = t2."clinic_id"
JOIN portfolio."vaccines" t3 ON t0."vaccine_id" = t3."vaccine_id"
ORDER BY t0."vaccination_id", t1."patient_id", t2."clinic_id", t3."vaccine_id"
LIMIT 20;

-- Find vaccination_records records where vaccination_date matches "2025-03-10" (up to 20).
SELECT * FROM portfolio."vaccination_records"
WHERE "vaccination_date" IS NOT DISTINCT FROM '2025-03-10'
ORDER BY "vaccination_id"
LIMIT 20;

EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON)
SELECT * FROM portfolio."vaccination_records"
WHERE "vaccination_date" IS NOT DISTINCT FROM '2025-03-10'
ORDER BY "vaccination_id"
LIMIT 20;

-- Count vaccination_records records for each patient_id (up to 20 groups).
SELECT "patient_id", count(*) AS record_count
FROM portfolio."vaccination_records"
GROUP BY "patient_id"
ORDER BY record_count DESC, "patient_id" NULLS LAST
LIMIT 20;

EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON)
SELECT "patient_id", count(*) AS record_count
FROM portfolio."vaccination_records"
GROUP BY "patient_id"
ORDER BY record_count DESC, "patient_id" NULLS LAST
LIMIT 20;

-- Find vaccination_records records where vaccination_date matches "2025-03-10" (up to 20).
SELECT * FROM portfolio."vaccination_records"
WHERE "vaccination_date" IS NOT DISTINCT FROM '2025-03-10'
ORDER BY "vaccination_id"
LIMIT 20;

EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON)
SELECT * FROM portfolio."vaccination_records"
WHERE "vaccination_date" IS NOT DISTINCT FROM '2025-03-10'
ORDER BY "vaccination_id"
LIMIT 20;
