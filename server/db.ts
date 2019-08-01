import { Client } from "pg";
const connectionString =
  "postgresql://postgres:postgres@127.0.0.1:5432/jarflix";

export const db = new Client({ connectionString: connectionString });
