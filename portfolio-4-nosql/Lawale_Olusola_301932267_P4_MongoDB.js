// Run once in mongosh against a fresh exercise database.
// These records are fictional events for the case study.
(async function () {
  db = db.getSiblingDB('portfolio_nosql');
  if ((await db.getCollectionNames()).includes("vaccination_events")) {
    throw new Error('The exercise collection already exists. Use a fresh database.');
  }

  // The validator checks the stable event fields while details can vary.
  await db.createCollection("vaccination_events", {
    validator: {
    "$jsonSchema": {
        "bsonType": "object",
        "required": [
            "_id",
            "schemaVersion",
            "simulation",
            "eventType",
            "occurredAt",
            "source",
            "embedded",
            "references",
            "details"
        ],
        "properties": {
            "_id": {
                "bsonType": "string",
                "minLength": 1
            },
            "schemaVersion": {
                "enum": [
                    1
                ]
            },
            "simulation": {
                "enum": [
                    true
                ]
            },
            "eventType": {
                "bsonType": "string",
                "enum": [
                    "vaccination_recorded",
                    "vaccination_corrected"
                ]
            },
            "occurredAt": {
                "bsonType": "date"
            },
            "source": {
                "bsonType": "object",
                "required": [
                    "entity",
                    "key",
                    "snapshot"
                ],
                "properties": {
                    "entity": {
                        "enum": [
                            "vaccination_records"
                        ]
                    },
                    "key": {
                        "bsonType": "object",
                        "required": [
                            "vaccination_id"
                        ]
                    },
                    "snapshot": {
                        "bsonType": "object"
                    }
                }
            },
            "embedded": {
                "bsonType": "object"
            },
            "references": {
                "bsonType": "object"
            },
            "details": {
                "bsonType": "object"
            }
        }
    }
},
    validationLevel: 'strict', validationAction: 'error'
  });

  // Insert the four example events and show their IDs.
  printjson(await db.getCollection("vaccination_events").insertMany([
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
    },
    {
        "_id": "event_000002",
        "schemaVersion": 1,
        "simulation": true,
        "eventType": "vaccination_corrected",
        "occurredAt": ISODate("2030-01-01T10:01:00Z"),
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
            "channel": "mobile",
            "note": "Illustrative event-specific metadata",
            "examples": {
                "correction_reason": "illustrative correction_reason",
                "source_system": "illustrative source_system",
                "event_metadata": "illustrative event_metadata"
            }
        }
    }
]));
  await db.getCollection("vaccination_events").createIndex({eventType: 1, occurredAt: -1}, {name: 'event_type_time'});

  // 1. Find the first sample event type (up to five documents).
  printjson(await db.getCollection("vaccination_events").find({"eventType":"vaccination_recorded"}).sort({_id:1}).limit(5).toArray());

  // 2. Find events for the first source record using nested key fields (up to five).
  printjson(await db.getCollection("vaccination_events").find({"source.key.vaccination_id":4001}).sort({_id:1}).limit(5).toArray());

  // 3. Find events in the sample time range using a MongoDB Date filter (up to five).
  printjson(await db.getCollection("vaccination_events").find({"occurredAt":{"$gte":ISODate("2030-01-01T10:00:00Z"), "$lt":ISODate("2030-01-01T11:00:00Z")}}).sort({_id:1}).limit(5).toArray());

  // 4. Count documents for each event type.
  printjson(await db.getCollection("vaccination_events").aggregate([{"$group":{"_id":"$eventType", "documentCount":{"$sum":1}}}, {"$sort":{"_id":1}}]).toArray());

  // A date stored as text should be rejected by the validator.
  try {
    await db.getCollection("vaccination_events").insertOne({...{
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
}, _id: 'invalid_date_example', occurredAt: 'not-a-date'});
  } catch (error) { print('Invalid date error: ' + error.code); }

  // Reusing an event ID should be rejected by the unique _id index.
  try { await db.getCollection("vaccination_events").insertOne({
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
}); }
  catch (error) { print('Duplicate ID error: ' + error.code); }

  print('Document count: ' + await db.getCollection("vaccination_events").countDocuments());
})().catch(error => { print(error.stack || String(error)); quit(1); });
