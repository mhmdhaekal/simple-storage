import { drizzle } from "drizzle-orm/libsql";
import { migrate } from "drizzle-orm/libsql/migrator";

async function main() {
	const db = Bun.env.DATABASE_URL;
	const auth_token = Bun.env.DATABASE_AUTH_TOKEN;

	if (!db) {
		console.error("No database URL found");
		process.exit(1);
	}

	try {
		await migrate(
			drizzle({
				connection: {
					url: db,
					authToken: auth_token,
				},
			}),
			{
				migrationsFolder: "./drizzle",
			},
		);
	} catch (error) {
		console.log(error);
		process.exit(1);
	}
}

main().then(() => {
	console.log("Migration complete");
	process.exit(0);
});
