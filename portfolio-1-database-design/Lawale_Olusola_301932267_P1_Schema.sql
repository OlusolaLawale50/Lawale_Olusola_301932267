-- Public Health Vaccination Programme: tables, keys and business constraints.
-- Run once in a fresh PostgreSQL database.
BEGIN;
SET LOCAL standard_conforming_strings = on;
CREATE SCHEMA portfolio;
CREATE TABLE portfolio."patients" (
  "patient_id" bigint NOT NULL,
  "given_name" text NOT NULL,
  "family_name" text NOT NULL,
  "birth_date" date NOT NULL,
  CONSTRAINT "pk_patients" PRIMARY KEY ("patient_id")
);
CREATE TABLE portfolio."clinics" (
  "clinic_id" bigint NOT NULL,
  "clinic_name" text NOT NULL,
  "locality" text NOT NULL,
  CONSTRAINT "pk_clinics" PRIMARY KEY ("clinic_id")
);
CREATE TABLE portfolio."vaccines" (
  "vaccine_id" bigint NOT NULL,
  "vaccine_name" text NOT NULL,
  "manufacturer" text NOT NULL,
  CONSTRAINT "pk_vaccines" PRIMARY KEY ("vaccine_id")
);
CREATE TABLE portfolio."vaccination_records" (
  "vaccination_id" bigint NOT NULL,
  "patient_id" bigint NOT NULL,
  "clinic_id" bigint NOT NULL,
  "vaccine_id" bigint NOT NULL,
  "vaccination_date" date NOT NULL,
  "dose_number" bigint NOT NULL,
  CONSTRAINT "pk_vaccination_records" PRIMARY KEY ("vaccination_id"),
  CONSTRAINT "uq_vaccination_records_0" UNIQUE ("patient_id", "vaccine_id", "dose_number")
);
ALTER TABLE portfolio."vaccination_records" ADD CONSTRAINT "fk_vaccination_records_0" FOREIGN KEY ("patient_id") REFERENCES portfolio."patients" ("patient_id");
ALTER TABLE portfolio."vaccination_records" ADD CONSTRAINT "fk_vaccination_records_1" FOREIGN KEY ("clinic_id") REFERENCES portfolio."clinics" ("clinic_id");
ALTER TABLE portfolio."vaccination_records" ADD CONSTRAINT "fk_vaccination_records_2" FOREIGN KEY ("vaccine_id") REFERENCES portfolio."vaccines" ("vaccine_id");
ALTER TABLE portfolio."vaccination_records" ADD CONSTRAINT "positive_dose_number" CHECK ("dose_number" > 0);
COMMIT;
