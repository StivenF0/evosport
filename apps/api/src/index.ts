import 'dotenv/config';
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import { Elysia } from "elysia";
import cors from '@elysiajs/cors';

const client = createClient({ url: process.env.DB_FILE_NAME! });
const db = drizzle({ client });

const app = new Elysia()
  .use(cors())
	.get('/', () => 'Hello Elysia')
	.listen(8080)

console.log(
	`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
)
