# Data Retention Policy

| Data | Location | Retention |
|------|----------|-----------|
| Assessment request payload | Assessment API RAM | Ephemeral |
| Assessment logs | Fly Postgres | 30 days |
| Generated PDFs | S3 (eu-central-1) | 7 days |
