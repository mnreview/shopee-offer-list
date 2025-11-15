# Database Capability Specification

## ADDED Requirements

### Requirement: Turso Database Connection
The system SHALL establish and maintain a connection to Turso database for persistent data storage.

#### Scenario: Successful database connection
- **GIVEN** valid Turso credentials in environment variables
- **WHEN** the application initializes
- **THEN** a database client is created and connection is established
- **AND** connection can execute queries successfully

#### Scenario: Missing credentials
- **GIVEN** Turso credentials are not set
- **WHEN** the application attempts to connect
- **THEN** an error is thrown with clear message
- **AND** application startup fails gracefully

#### Scenario: Connection retry
- **GIVEN** database is temporarily unavailable
- **WHEN** connection attempt fails
- **THEN** system retries with exponential backoff
- **AND** logs connection attempts for debugging

### Requirement: Database Schema Management
The system SHALL provide a migration system for managing database schema changes.

#### Scenario: Initial schema creation
- **GIVEN** a fresh Turso database
- **WHEN** migration script is executed
- **THEN** the `offers` table is created with all required columns
- **AND** appropriate indexes are created
- **AND** migration is recorded in migration history

#### Scenario: Schema already exists
- **GIVEN** database schema is already up to date
- **WHEN** migration script is executed
- **THEN** no changes are made
- **AND** system reports schema is current

#### Scenario: Migration rollback
- **GIVEN** a migration needs to be reverted
- **WHEN** rollback command is executed
- **THEN** schema changes are reversed
- **AND** data integrity is maintained

### Requirement: Offers Table Structure
The system SHALL maintain an `offers` table with the following schema to store Shopee product data.

#### Scenario: Table structure verification
- **GIVEN** the offers table exists
- **WHEN** table schema is inspected
- **THEN** the following columns exist:
  - `offer_id` TEXT PRIMARY KEY
  - `name` TEXT NOT NULL
  - `price` REAL
  - `commission_rate` REAL
  - `commission` REAL
  - `link` TEXT
  - `image_url` TEXT
  - `category_name` TEXT
  - `updated_at` INTEGER NOT NULL
- **AND** an index exists on `updated_at` column
- **AND** an index exists on `category_name` column

#### Scenario: Data type validation
- **GIVEN** data is being inserted into offers table
- **WHEN** column types are validated
- **THEN** `offer_id` accepts text strings
- **AND** `price`, `commission_rate`, `commission` accept floating point numbers
- **AND** `updated_at` accepts Unix timestamps (integers)
- **AND** NULL values are rejected for required fields

### Requirement: Database Query Interface
The system SHALL provide a typed interface for executing database queries safely.

#### Scenario: Parameterized query execution
- **GIVEN** a query with parameters
- **WHEN** query is executed through the interface
- **THEN** parameters are properly escaped to prevent SQL injection
- **AND** query results are returned with correct types
- **AND** errors are caught and handled appropriately

#### Scenario: Batch operations
- **GIVEN** multiple records to insert/update
- **WHEN** batch operation is executed
- **THEN** all operations are performed in a single transaction
- **AND** operation completes in optimal time
- **AND** partial failures rollback entire batch

#### Scenario: Query timeout handling
- **GIVEN** a long-running query
- **WHEN** query execution time exceeds timeout limit
- **THEN** query is cancelled
- **AND** connection is released back to pool
- **AND** timeout error is logged with query details

### Requirement: Environment Configuration
The system SHALL load database configuration from environment variables securely.

#### Scenario: Load configuration from .env file
- **GIVEN** a `.env` file with database credentials
- **WHEN** application starts in development mode
- **THEN** environment variables are loaded correctly
- **AND** credentials are not logged or exposed
- **AND** validation ensures all required variables exist

#### Scenario: Production environment variables
- **GIVEN** environment variables set in cloud environment
- **WHEN** application runs in production
- **THEN** cloud provider's environment variables are used
- **AND** no .env file is required
- **AND** missing variables cause startup failure with clear errors

#### Scenario: Configuration validation
- **GIVEN** environment variables are loaded
- **WHEN** configuration is validated
- **THEN** TURSO_DATABASE_URL format is verified
- **AND** TURSO_AUTH_TOKEN is present and non-empty
- **AND** invalid configuration fails fast with helpful error messages
