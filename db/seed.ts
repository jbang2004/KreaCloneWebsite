import { db } from "./index";
import * as schema from "../shared/schema";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function seed() {
  try {
    // seed data here
    await db.insert(schema.users).values([
      { username: "admin", password: await hashPassword("admin123") },
      { username: "test", password: await hashPassword("test123") }
    ]).onConflictDoNothing();
    
    console.log("数据填充成功");
  } catch (error) {
    console.error(error);
  }
}

seed();
