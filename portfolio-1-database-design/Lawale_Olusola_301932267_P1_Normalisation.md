# Public Health Vaccination Programme — normalisation

The example uses the saved sample records. The full set of fields is in the design and schema.

## Starting grouped records

| patient_id | vaccination_records records (list) |
| --- | --- |
| 1001 | [4001] |


The record IDs are grouped in a list. In 1NF, each record has its own row and each cell holds one value.

## 1NF: one value per cell

| vaccination_records.vaccination_id | vaccination_records.patient_id | vaccination_records.clinic_id | vaccination_records.vaccine_id | patients.patient_id | patients.given_name | clinics.clinic_id | clinics.clinic_name |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 4001 | 1001 | 2001 | 3001 | 1001 | Ari | 2001 | North Fictional Clinic |

Key: vaccination_id.

## 2NF: depend on the whole key

vaccination_records: patient_id is a proper part of candidate key (patient_id, vaccine_id, dose_number), and determines patients details. vaccination_records: vaccine_id is a proper part of candidate key (patient_id, vaccine_id, dose_number), and determines vaccines details.

## patients_example

| patients.patient_id | patients.given_name |
| --- | --- |
| 1001 | Ari |

## vaccination_records_example

| vaccination_records.vaccination_id | vaccination_records.patient_id | vaccination_records.clinic_id | vaccination_records.vaccine_id | clinics.clinic_id | clinics.clinic_name |
| --- | --- | --- | --- | --- | --- |
| 4001 | 1001 | 2001 | 3001 | 2001 | North Fictional Clinic |

## 3NF: store each entity’s details once

The entity keys determine their own descriptions. Related records keep foreign keys rather than repeating those descriptions.

## patients

| patient_id | given_name | family_name | birth_date |
| --- | --- | --- | --- |
| 1001 | Ari | Example | 1985-04-12 |

## clinics

| clinic_id | clinic_name | locality |
| --- | --- | --- |
| 2001 | North Fictional Clinic | Sampleton |

## vaccines

| vaccine_id | vaccine_name | manufacturer |
| --- | --- | --- |
| 3001 | Example Vaccine | Fictional Biologics |

## vaccination_records

| vaccination_id | patient_id | clinic_id | vaccine_id | vaccination_date | dose_number |
| --- | --- | --- | --- | --- | --- |
| 4001 | 1001 | 2001 | 3001 | 2025-03-10 | 1 |

## Dependencies

- patients: (patient_id) → given_name, family_name, birth_date
- clinics: (clinic_id) → clinic_name, locality
- vaccines: (vaccine_id) → vaccine_name, manufacturer
- vaccination_records: (vaccination_id) → patient_id, clinic_id, vaccine_id, vaccination_date, dose_number

Joining the decomposed sample tables reproduces the original 1 example rows. The design assumes the declared keys describe the relevant business dependencies.
