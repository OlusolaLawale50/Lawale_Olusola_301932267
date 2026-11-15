# Public Health Vaccination Programme — SQL queries

## 1. Show related vaccination_records, patients, clinics, vaccines records (up to 20).

```sql
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
```

| vaccination_records_vaccination_id | vaccination_records_vaccination_date | patients_patient_id | patients_given_name | clinics_clinic_id | clinics_clinic_name | vaccines_vaccine_id | vaccines_vaccine_name |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 4001 | 2025-03-10 | 1001 | Ari | 2001 | North Fictional Clinic | 3001 | Example Vaccine |

## 2. Find vaccination_records records where vaccination_date matches "2025-03-10" (up to 20).

```sql
SELECT * FROM portfolio."vaccination_records"
WHERE "vaccination_date" IS NOT DISTINCT FROM '2025-03-10'
ORDER BY "vaccination_id"
LIMIT 20;
```

| vaccination_id | patient_id | clinic_id | vaccine_id | vaccination_date | dose_number |
| --- | --- | --- | --- | --- | --- |
| 4001 | 1001 | 2001 | 3001 | 2025-03-10 | 1 |

## 3. Count vaccination_records records for each patient_id (up to 20 groups).

```sql
SELECT "patient_id", count(*) AS record_count
FROM portfolio."vaccination_records"
GROUP BY "patient_id"
ORDER BY record_count DESC, "patient_id" NULLS LAST
LIMIT 20;
```

| patient_id | record_count |
| --- | --- |
| 1001 | 1 |

## 4. Find vaccination_records records where vaccination_date matches "2025-03-10" (up to 20).

```sql
SELECT * FROM portfolio."vaccination_records"
WHERE "vaccination_date" IS NOT DISTINCT FROM '2025-03-10'
ORDER BY "vaccination_id"
LIMIT 20;
```

| vaccination_id | patient_id | clinic_id | vaccine_id | vaccination_date | dose_number |
| --- | --- | --- | --- | --- | --- |
| 4001 | 1001 | 2001 | 3001 | 2025-03-10 | 1 |


## Index comparison

| Phase | Median (ms) | Three runs (ms) | Plan nodes | Buffer hits |
| --- | --- | --- | --- | --- |
| Before index | 2.138 | 2.138, 1.416, 2.766 | Sort → Seq Scan | 112 |
| After index | 0.182 | 0.177, 0.186, 0.182 | Sort → Bitmap Heap Scan → Bitmap Index Scan | 25 |

The median execution time changed from 2.138 ms to 0.182 ms. The measured plan used p2_filter_idx. The results matched in both phases. An index adds storage and write-maintenance costs; timings depend on the selected lookup and environment.

## Execution plans

### Before index, run 1

```text
Sort (actual time=2.096..2.098 rows=20 loops=1)
  Seq Scan on vaccination_records (actual time=0.027..1.786 rows=20 loops=1)
Planning Time: 0.54 ms
Execution Time: 2.138 ms
```

### Before index, run 2

```text
Sort (actual time=1.386..1.387 rows=20 loops=1)
  Seq Scan on vaccination_records (actual time=0.021..1.336 rows=20 loops=1)
Planning Time: 0.494 ms
Execution Time: 1.416 ms
```

### Before index, run 3

```text
Sort (actual time=2.73..2.732 rows=20 loops=1)
  Seq Scan on vaccination_records (actual time=0.021..1.614 rows=20 loops=1)
Planning Time: 0.508 ms
Execution Time: 2.766 ms
```

### After index, run 1

```text
Sort (actual time=0.126..0.127 rows=20 loops=1)
  Bitmap Heap Scan on vaccination_records (actual time=0.027..0.092 rows=20 loops=1)
    Bitmap Index Scan using p2_filter_idx (actual time=0.014..0.014 rows=20 loops=1)
Planning Time: 0.582 ms
Execution Time: 0.177 ms
```

### After index, run 2

```text
Sort (actual time=0.134..0.135 rows=20 loops=1)
  Bitmap Heap Scan on vaccination_records (actual time=0.029..0.094 rows=20 loops=1)
    Bitmap Index Scan using p2_filter_idx (actual time=0.015..0.015 rows=20 loops=1)
Planning Time: 0.576 ms
Execution Time: 0.186 ms
```

### After index, run 3

```text
Sort (actual time=0.129..0.131 rows=20 loops=1)
  Bitmap Heap Scan on vaccination_records (actual time=0.027..0.092 rows=20 loops=1)
    Bitmap Index Scan using p2_filter_idx (actual time=0.014..0.014 rows=20 loops=1)
Planning Time: 0.576 ms
Execution Time: 0.182 ms
```

## Reproduce

Use a fresh database with the Portfolio 1 schema and sample data. Run Lawale_Olusola_301932267_P2_Queries.sql, then Lawale_Olusola_301932267_P2_Optimisation.sql. The optimisation script creates a separate performance table and runs EXPLAIN (ANALYZE, BUFFERS).

[Query screenshot](screenshots/Lawale_Olusola_301932267_P2_QueryResults.png) · [Index comparison](screenshots/Lawale_Olusola_301932267_P2_IndexComparison.png)

## References

- [PostgreSQL — EXPLAIN](https://www.postgresql.org/docs/17/using-explain.html)

