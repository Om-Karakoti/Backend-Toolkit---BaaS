# Database Integration Example

This example demonstrates how to integrate the **`@gfg-backend/database`** package into a project alongside other toolkit modules:

- **`@gfg-backend/database`**: Connects to the database and provides the database adapter for managing records.
- **`@gfg-backend/config`**: Supplies configuration parameters for database connection strings and credentials.
- **`@gfg-backend/logger`**: Represents structured operational logging.
- **`@gfg-backend/errors`**: Standardizes error handling with application errors.

> **Note on Storage Implementation:**
> As `@gfg-backend/database` currently provides early scaffolding/stubs in the toolkit, database persistence in this example is demonstrated via in-memory storage alongside the `DatabaseAdapter` connection interface.

## Structure

```text
database/
├── package.json
├── tsconfig.json
├── README.md
└── src/
    └── index.ts      # PostRepository implementation and CRUD usage example
```

## Running the Example

1. **Install dependencies** from the repository root:
   ```bash
   npm install
   ```

2. **Run the example**:
   ```bash
   # From the project root:
   npx tsx examples/database/src/index.ts

   # Or from this directory:
   npm start
   ```

3. **Typecheck**:
   ```bash
   npm run typecheck
   ```
