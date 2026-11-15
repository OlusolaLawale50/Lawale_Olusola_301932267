-- Fictional sample records for Public Health Vaccination Programme.
BEGIN;
SET LOCAL standard_conforming_strings = on;
INSERT INTO portfolio."patients" ("patient_id", "given_name", "family_name", "birth_date") VALUES (1001, 'Ari', 'Example', '1985-04-12');
INSERT INTO portfolio."clinics" ("clinic_id", "clinic_name", "locality") VALUES (2001, 'North Fictional Clinic', 'Sampleton');
INSERT INTO portfolio."vaccines" ("vaccine_id", "vaccine_name", "manufacturer") VALUES (3001, 'Example Vaccine', 'Fictional Biologics');
INSERT INTO portfolio."vaccination_records" ("vaccination_id", "patient_id", "clinic_id", "vaccine_id", "vaccination_date", "dose_number") VALUES (4001, 1001, 2001, 3001, '2025-03-10', 1);
COMMIT;
