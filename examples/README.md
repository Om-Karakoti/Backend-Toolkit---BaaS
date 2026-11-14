# Examples

This directory contains example projects demonstrating how Backend Toolkit - BaaS packages can be used.

## Planned Examples

### Basic Backend

TODO:
Create a basic backend example using the toolkit.

### Authentication

TODO:
Create an example demonstrating the authentication package.

### Database

A standalone example project is available in the [`database`](./database) directory.

It shows how an application connects to a database and runs CRUD operations using `@gfg-backend/database`, accompanied by `@gfg-backend/config`, `@gfg-backend/logger`, and `@gfg-backend/errors`:

1. **Configuration**: Load connection credentials using `@gfg-backend/config`.
2. **Connection**: Establish the database connection via `connectDatabase`.
3. **CRUD Operations**: Execute create, read, update, and delete operations on records.
4. **Error Handling**: Handle database operation failures and not-found records gracefully.

```ts
import { loadConfig } from "@gfg-backend/config";
import { connectDatabase } from "@gfg-backend/database";
import { BaseError } from "@gfg-backend/errors";
import { createLogger } from "@gfg-backend/logger";

const config = loadConfig();
const db = connectDatabase(config);
const logger = createLogger();

async function getPost(id: string) {
  try {
    // In a complete implementation, this invokes the database adapter:
    // const post = await db.query("SELECT * FROM posts WHERE id = $1", [id]);
    return { id, title: "Sample Post" };
  } catch (error) {
    if (error instanceof BaseError) throw error;
    throw new BaseError("Database query failed");
  }
}
```

For the standalone runnable project files and detailed setup instructions, see [`examples/database`](./database/README.md).

### Full Toolkit

A complete standalone example project is available in the [`full-toolkit`](./full-toolkit) directory.

It shows how an application combines configuration, validation, authentication, database access, logging, and shared error handling in one cohesive workflow:

1. **Config**: Load application configurations with `@gfg-backend/config`.
2. **Validation**: Validate incoming registration payloads using `@gfg-backend/validation`.
3. **Authentication**: Enforce security and authentication policies via `@gfg-backend/auth`.
4. **Database**: Manage data persistence with the `@gfg-backend/database` adapter (simulated while adapter CRUD utilities are in development).
5. **Logger**: Log operations and diagnostic events using `@gfg-backend/logger`.
6. **Errors**: Handle domain errors using `@gfg-backend/errors`.

```ts
import { loadConfig } from "@gfg-backend/config";
import { authenticate } from "@gfg-backend/auth";
import { connectDatabase } from "@gfg-backend/database";
import { BaseError, ValidationError } from "@gfg-backend/errors";
import { createLogger } from "@gfg-backend/logger";
import { validate } from "@gfg-backend/validation";

const config = loadConfig();
const db = connectDatabase(config);
const logger = createLogger();

async function registerUser(input: unknown) {
  try {
    const result = validate(input);
    if (!result.valid) {
      throw new ValidationError(result.errors.join(", "));
    }

    // Protect this operation according to the application's auth policy
    authenticate();

    // In a complete implementation, this calls db adapter methods:
    // const user = await db.users.create(input);
    return { success: true };
  } catch (error) {
    if (error instanceof BaseError) throw error;
    throw new BaseError("Unable to register user");
  }
}
```

For the complete standalone runnable project files, directory structure, and instructions, see [`examples/full-toolkit`](./full-toolkit/README.md).
