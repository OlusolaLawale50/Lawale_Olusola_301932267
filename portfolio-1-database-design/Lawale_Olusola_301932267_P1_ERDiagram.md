# Public Health Vaccination Programme — ER diagram

```mermaid
erDiagram
    direction LR
    patients {
        bigint patient_id PK
        text given_name
        text family_name
        date birth_date
    }
    clinics {
        bigint clinic_id PK
        text clinic_name
        text locality
    }
    vaccines {
        bigint vaccine_id PK
        text vaccine_name
        text manufacturer
    }
    vaccination_records {
        bigint vaccination_id PK
        bigint patient_id FK
        bigint clinic_id FK
        bigint vaccine_id FK
        date vaccination_date
        integer dose_number
    }
    patients ||--o{ vaccination_records : "patient_id"
    clinics ||--o{ vaccination_records : "clinic_id"
    vaccines ||--o{ vaccination_records : "vaccine_id"
```

PK identifies a record; FK links to another table; UK marks a single-field unique value. The relationship ends show exactly one, zero or one, or zero or many records. Composite unique keys and conditional rules are listed in the schema and design.

[Diagram image](../images/Lawale_Olusola_301932267_ERDiagram.png)
