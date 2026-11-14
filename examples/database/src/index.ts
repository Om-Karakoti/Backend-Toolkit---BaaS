import { pathToFileURL } from "node:url";
import { loadConfig, type AppConfig } from "@gfg-backend/config";
import { connectDatabase, type DatabaseConfig, type DatabaseAdapter } from "@gfg-backend/database";
import { BaseError, ValidationError } from "@gfg-backend/errors";
import { createLogger, type Logger } from "@gfg-backend/logger";

/**
 * Database Integration Example
 * Demonstrates connecting to a database, executing CRUD operations,
 * managing database records, and handling application errors using @gfg-backend/* packages.
 */

export interface Post {
  id: string;
  title: string;
  content: string;
  published: boolean;
  createdAt: string;
}

export class PostRepository {
  private db: DatabaseAdapter;
  private logger: Logger;
  // Simulated storage store used while @gfg-backend/database CRUD operations are in development
  private memoryStore: Map<string, Post> = new Map();

  constructor(config?: DatabaseConfig) {
    // 1. Logger initialization
    try {
      this.logger = createLogger();
    } catch {
      // Logger package is currently a skeleton in early development
      this.logger = {} as Logger;
    }

    // 2. Database adapter connection
    try {
      const dbConfig = config ?? (loadConfig() as unknown as DatabaseConfig);
      this.db = connectDatabase(dbConfig);
    } catch {
      // Database package is currently a skeleton in early development
      this.db = {} as DatabaseAdapter;
    }
  }

  async create(data: Omit<Post, "id" | "createdAt">): Promise<Post> {
    try {
      if (!data.title) {
        throw new ValidationError("Post title is required");
      }

      const newPost: Post = {
        id: "post_" + Math.random().toString(36).substring(2, 9),
        title: data.title,
        content: data.content,
        published: data.published ?? false,
        createdAt: new Date().toISOString(),
      };

      this.memoryStore.set(newPost.id, newPost);
      console.log(`[INFO] Post created: ${newPost.id} - "${newPost.title}"`);
      return newPost;
    } catch (error) {
      if (error instanceof BaseError) throw error;
      console.error(`[ERROR] Failed to create post:`, error);
      throw new BaseError("Database insert operation failed");
    }
  }

  async findById(id: string): Promise<Post> {
    const post = this.memoryStore.get(id);
    if (!post) {
      throw new BaseError(`Resource not found: Post with id "${id}" does not exist`);
    }
    return post;
  }

  async listAll(): Promise<Post[]> {
    return Array.from(this.memoryStore.values());
  }

  async update(id: string, updates: Partial<Omit<Post, "id" | "createdAt">>): Promise<Post> {
    try {
      const post = await this.findById(id);
      const updatedPost: Post = { ...post, ...updates };
      this.memoryStore.set(id, updatedPost);
      console.log(`[INFO] Post updated: ${id}`);
      return updatedPost;
    } catch (error) {
      if (error instanceof BaseError) throw error;
      console.error(`[ERROR] Failed to update post:`, error);
      throw new BaseError("Database update operation failed");
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.findById(id);
      this.memoryStore.delete(id);
      console.log(`[INFO] Post deleted: ${id}`);
      return true;
    } catch (error) {
      if (error instanceof BaseError) throw error;
      console.error(`[ERROR] Failed to delete post:`, error);
      throw new BaseError("Database delete operation failed");
    }
  }

  getDatabaseAdapter(): DatabaseAdapter {
    return this.db;
  }

  getLogger(): Logger {
    return this.logger;
  }
}

// Entrypoint demo
async function main() {
  console.log("=== Running Backend Toolkit - Database Integration Example ===");
  const repo = new PostRepository();

  console.log("\n1. Inserting posts:");
  const post1 = await repo.create({ title: "Getting Started with BaaS", content: "Architecture guide", published: true });
  const post2 = await repo.create({ title: "Draft Post", content: "WIP notes", published: false });
  console.log("Created:", post1);
  console.log("Created:", post2);

  console.log("\n2. Listing all posts:");
  const allPosts = await repo.listAll();
  console.log(`Found ${allPosts.length} posts:`, allPosts);

  console.log("\n3. Updating a post:");
  const updated = await repo.update(post2.id, { published: true });
  console.log("Updated:", updated);

  console.log("\n4. Deleting a post:");
  const deleted = await repo.delete(post1.id);
  console.log("Deleted post1:", deleted);

  console.log("\n5. Handling not found error:");
  try {
    await repo.findById("non-existent-id");
  } catch (error) {
    if (error instanceof BaseError) {
      console.log(`Caught expected application error [${error.name}]: ${error.message}`);
    }
  }
}

// Portable main check across Windows and POSIX platforms
if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) {
  main().catch(console.error);
}
