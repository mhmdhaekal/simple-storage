import { initApp } from "./app/app/app";
import { get_config_or_throw } from "./app/app/config";

let config = get_config_or_throw();
let app = initApp(config);

export default {
	port: config.port,
	fetch: app.fetch,
};
