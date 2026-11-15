# Public Health Vaccination Programme — database design

My case study records patients, clinics, vaccines, vaccination_records.

## Users

- Fictional clinic staff recording vaccinations.
- Fictional programme analysts reviewing vaccination activity.

## Main operations

- Record a vaccination with its patient, clinic, vaccine, date, and dose number.
- Review vaccination records with patient, clinic, and vaccine details.
- Summarise records by clinic and vaccine.

## Entities

| Entity | Information stored |
| --- | --- |
| patients | Stores fictional patient identity details referenced by vaccination records. |
| clinics | Stores fictional clinics where vaccinations are administered. |
| vaccines | Stores fictional vaccine products referenced by vaccination records. |
| vaccination_records | Records each fictional vaccination and references its patient, clinic, and vaccine. |

## patients

| Field | Type | Key | Required |
| --- | --- | --- | --- |
| patient_id | BIGINT | PK | Yes |
| given_name | TEXT |  | Yes |
| family_name | TEXT |  | Yes |
| birth_date | DATE |  | Yes |


## clinics

| Field | Type | Key | Required |
| --- | --- | --- | --- |
| clinic_id | BIGINT | PK | Yes |
| clinic_name | TEXT |  | Yes |
| locality | TEXT |  | Yes |


## vaccines

| Field | Type | Key | Required |
| --- | --- | --- | --- |
| vaccine_id | BIGINT | PK | Yes |
| vaccine_name | TEXT |  | Yes |
| manufacturer | TEXT |  | Yes |


## vaccination_records

| Field | Type | Key | Required |
| --- | --- | --- | --- |
| vaccination_id | BIGINT | PK | Yes |
| patient_id | BIGINT | FK | Yes |
| clinic_id | BIGINT | FK | Yes |
| vaccine_id | BIGINT | FK | Yes |
| vaccination_date | DATE |  | Yes |
| dose_number | INTEGER |  | Yes |
- patient_id → patients.patient_id
- clinic_id → clinics.clinic_id
- vaccine_id → vaccines.vaccine_id
- Unique key: (patient_id, vaccine_id, dose_number).

## Relationships and business rules

- Every vaccination record must reference an existing patient.
- Every vaccination record must reference an existing clinic.
- Every vaccination record must reference an existing vaccine.
- A vaccination record's dose_number must be greater than zero.
- A patient may have at most one record for each vaccine and dose number.

## Assumptions

- All records and example values are fictional; no real patient or student names or identifiers are included.
- Each entity has a single-column globally unique identifier primary key.
- A vaccination record represents one administration; dose_number is a positive sequence number for that patient and vaccine.
- Vaccination date is a calendar date, and patient, clinic, and vaccine references are required.
- The database enforces uniqueness of patient_id, vaccine_id, and dose_number together; no vaccine-lot or workflow rules are in scope.

