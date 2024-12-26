import { drizzle } from "drizzle-orm/libsql";

const database_url = Bun.env.DATABASE_URL;
const database_auth_token = Bun.env.DATABASE_AUTH_TOKEN;

if (!database_url) {
	throw new Error("Invalid Database URL");
}

const db = drizzle({
	connection: {
		url: database_url,
		authToken: database_auth_token,
	},
});

const get_db = () => db;

type Db = typeof db;

export { get_db, type Db };