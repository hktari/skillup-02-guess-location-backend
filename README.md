This is the backend for the skillup mentor project 02: "Guess Location" app.

It uses NestJS for the api implementation. Postgresql for the database. Jest for testing


## Required functionality:
- JWT token authentication
- Implement forgot password functionality (send reset token to
user email)
- File upload on Amazon S3
- JSON server responses
- Docker
    - For local environment configuration (database, env vars,
...)
    - Dockerfile for building a docker image from the
application code
- Deploy backend Docker Container on AWS
- Tests (backend only)
    - All your endpoints must have at least one test, multiple
edge case tests are a bonus
    - All tests must pass
    - Separate environment for testing
- Implement Logging (logger)
- Implement Cors (Cross-origin resource sharing)
- Migrations for database
- Swagger for API documentation