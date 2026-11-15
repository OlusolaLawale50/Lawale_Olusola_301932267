-- Run these deliberately invalid statements one at a time, outside a transaction.
-- Each should fail at the named constraint; the sample rows should remain unchanged.

-- 1. patients pk reject. Expected: pk_patients, SQLSTATE 23505.
INSERT INTO portfolio."patients" ("patient_id", "given_name", "family_name", "birth_date")
VALUES (1001, 'Bea', 'Sample', '1990-06-08');

-- 2. patients given name not null reject. Expected: given_name, SQLSTATE 23502.
INSERT INTO portfolio."patients" ("patient_id", "given_name", "family_name", "birth_date")
VALUES (1101, NULL, 'Sample', '1990-06-08');

-- 3. clinics pk reject. Expected: pk_clinics, SQLSTATE 23505.
INSERT INTO portfolio."clinics" ("clinic_id", "clinic_name", "locality")
VALUES (2001, 'South Fictional Clinic', 'Exampleville');

-- 4. vaccines pk reject. Expected: pk_vaccines, SQLSTATE 23505.
INSERT INTO portfolio."vaccines" ("vaccine_id", "vaccine_name", "manufacturer")
VALUES (3001, 'Sample Vaccine', 'Imaginary Labs');

-- 5. vaccination records pk reject. Expected: pk_vaccination_records, SQLSTATE 23505.
INSERT INTO portfolio."vaccination_records" ("vaccination_id", "patient_id", "clinic_id", "vaccine_id", "vaccination_date", "dose_number")
VALUES (4001, 1001, 2001, 3001, '2025-04-11', 2);

-- 6. vaccination records unique reject. Expected: uq_vaccination_records_0, SQLSTATE 23505.
INSERT INTO portfolio."vaccination_records" ("vaccination_id", "patient_id", "clinic_id", "vaccine_id", "vaccination_date", "dose_number")
VALUES (4002, 1001, 2001, 3001, '2025-04-11', 1);

-- 7. vaccination records patient fk reject. Expected: fk_vaccination_records_0, SQLSTATE 23503.
INSERT INTO portfolio."vaccination_records" ("vaccination_id", "patient_id", "clinic_id", "vaccine_id", "vaccination_date", "dose_number")
VALUES (4003, 9991, 2001, 3001, '2025-04-12', 2);

-- 8. vaccination records clinic fk reject. Expected: fk_vaccination_records_1, SQLSTATE 23503.
INSERT INTO portfolio."vaccination_records" ("vaccination_id", "patient_id", "clinic_id", "vaccine_id", "vaccination_date", "dose_number")
VALUES (4004, 1001, 9992, 3001, '2025-04-12', 2);

-- 9. vaccination records vaccine fk reject. Expected: fk_vaccination_records_2, SQLSTATE 23503.
INSERT INTO portfolio."vaccination_records" ("vaccination_id", "patient_id", "clinic_id", "vaccine_id", "vaccination_date", "dose_number")
VALUES (4005, 1001, 2001, 9993, '2025-04-12', 2);

-- 10. vaccination records positive dose reject. Expected: positive_dose_number, SQLSTATE 23514.
INSERT INTO portfolio."vaccination_records" ("vaccination_id", "patient_id", "clinic_id", "vaccine_id", "vaccination_date", "dose_number")
VALUES (4006, 1001, 2001, 3001, '2025-04-12', 0);
