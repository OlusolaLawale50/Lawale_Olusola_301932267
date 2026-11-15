# Portfolio 4 — NoSQL and Advanced Data Models

I used MongoDB collection vaccination_events for vaccination_recorded and vaccination_corrected events. These are fictional event examples based on vaccination_records, patients, clinics, vaccines.

## Document model

| Field | Meaning |
| --- | --- |
| _id | Unique string event ID |
| eventType | One of the two selected case event labels |
| occurredAt | Native BSON Date; sample timestamps are in 2030 |
| source | Original entity, primary key and saved JSON snapshot |
| embedded | Linked record snapshots read with the event |
| references | Keys for linked sources kept outside the embedded snapshots |
| details | Event metadata whose fields vary |

Related patients, clinics, vaccines details are stored as snapshots with the event. This makes an event readable in one document. It duplicates some information, and later SQL changes do not automatically update the snapshots. PostgreSQL continues to enforce the relational rules.

## Example document

```javascript
{
    "_id": "event_000001",
    "schemaVersion": 1,
    "simulation": true,
    "eventType": "vaccination_recorded",
    "occurredAt": ISODate("2030-01-01T10:00:00Z"),
    "source": {
        "entity": "vaccination_records",
        "key": {
            "vaccination_id": 4001
        },
        "snapshot": {
            "vaccination_id": 4001,
            "patient_id": 1001,
            "clinic_id": 2001,
            "vaccine_id": 3001,
            "vaccination_date": "2025-03-10",
            "dose_number": 1
        }
    },
    "embedded": {
        "patients": [
            {
                "key": {
                    "patient_id": 1001
                },
                "snapshot": {
                    "patient_id": 1001,
                    "given_name": "Ari",
                    "family_name": "Example",
                    "birth_date": "1985-04-12"
                },
                "via": [
                    "vaccination_records.patient_id → patients"
                ]
            }
        ],
        "clinics": [
            {
                "key": {
                    "clinic_id": 2001
                },
                "snapshot": {
                    "clinic_id": 2001,
                    "clinic_name": "North Fictional Clinic",
                    "locality": "Sampleton"
                },
                "via": [
                    "vaccination_records.clinic_id → clinics"
                ]
            }
        ],
        "vaccines": [
            {
                "key": {
                    "vaccine_id": 3001
                },
                "snapshot": {
                    "vaccine_id": 3001,
                    "vaccine_name": "Example Vaccine",
                    "manufacturer": "Fictional Biologics"
                },
                "via": [
                    "vaccination_records.vaccine_id → vaccines"
                ]
            }
        ]
    },
    "references": {},
    "details": {
        "channel": "web"
    }
}
```

## Queries and results

| Query | Returned documents |
| --- | --- |
| Find the first sample event type (up to five documents). | 1 |
| Find events for the first source record using nested key fields (up to five). | 2 |
| Find events in the sample time range using a MongoDB Date filter (up to five). | 2 |
| Count documents for each event type. | 2 |

## 1. Find the first sample event type (up to five documents).

```javascript
db.getCollection("vaccination_events").find({"eventType":"vaccination_recorded"}).sort({_id:1}).limit(5).toArray();
```

Selected fields from the returned documents:

```json
[
  {
    "_id": "event_000001",
    "eventType": "vaccination_recorded",
    "occurredAt": {
      "$date": "2030-01-01T10:00:00Z"
    },
    "source": {
      "vaccination_id": 4001
    }
  }
]
```

## 2. Find events for the first source record using nested key fields (up to five).

```javascript
db.getCollection("vaccination_events").find({"source.key.vaccination_id":4001}).sort({_id:1}).limit(5).toArray();
```

Selected fields from the returned documents:

```json
[
  {
    "_id": "event_000001",
    "eventType": "vaccination_recorded",
    "occurredAt": {
      "$date": "2030-01-01T10:00:00Z"
    },
    "source": {
      "vaccination_id": 4001
    }
  },
  {
    "_id": "event_000002",
    "eventType": "vaccination_corrected",
    "occurredAt": {
      "$date": "2030-01-01T10:01:00Z"
    },
    "source": {
      "vaccination_id": 4001
    }
  }
]
```

## 3. Find events in the sample time range using a MongoDB Date filter (up to five).

```javascript
db.getCollection("vaccination_events").find({"occurredAt":{"$gte":ISODate("2030-01-01T10:00:00Z"), "$lt":ISODate("2030-01-01T11:00:00Z")}}).sort({_id:1}).limit(5).toArray();
```

Selected fields from the returned documents:

```json
[
  {
    "_id": "event_000001",
    "eventType": "vaccination_recorded",
    "occurredAt": {
      "$date": "2030-01-01T10:00:00Z"
    },
    "source": {
      "vaccination_id": 4001
    }
  },
  {
    "_id": "event_000002",
    "eventType": "vaccination_corrected",
    "occurredAt": {
      "$date": "2030-01-01T10:01:00Z"
    },
    "source": {
      "vaccination_id": 4001
    }
  }
]
```

## 4. Count documents for each event type.

```javascript
db.getCollection("vaccination_events").aggregate([{"$group":{"_id":"$eventType", "documentCount":{"$sum":1}}}, {"$sort":{"_id":1}}]).toArray();
```

| _id | documentCount |
| --- | --- |
| vaccination_corrected | 1 |
| vaccination_recorded | 1 |

## Validation and suitability

MongoDB inserted 2 documents. An invalid date type was rejected with code 121 and a repeated event ID with 11000. The collection still contained 2 valid documents. The compound eventType/occurredAt index supports those access fields; this exercise does not measure its speed.

The details field can vary across event types, while the common fields have a validator. Events can be added as separate documents rather than growing one large history record.

## Run the script

Connect mongosh to a fresh exercise database and run Lawale_Olusola_301932267_P4_MongoDB.js. It selects portfolio_nosql, creates the collection, inserts the sample documents and displays the query results. [Implementation evidence](screenshots/Lawale_Olusola_301932267_P4_DocumentsAndQueries.png).

## References

- [MongoDB — data modelling](https://www.mongodb.com/docs/manual/data-modeling/)

