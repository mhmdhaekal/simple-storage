import { createFactory } from "hono/factory";
import { get_db, type Db } from "../database/lib";
import { get_config_or_throw, type Config } from "./config";

type Env = {
	Variables: {
		db: Db;
		config: Config;
	};
};

export default createFactory<Env>({
	initApp: (app) => {
		app.use(async (c, next) => {
			c.set("db", get_db());
			c.set("config", get_config_or_throw());
			await next();
		});
	},
});
