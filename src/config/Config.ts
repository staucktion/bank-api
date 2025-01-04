import EnvVariables from "src/env/EnvVariables";

class Config {
	static port = EnvVariables.port;
	static mode = EnvVariables.mode;
	static requestLog = EnvVariables.requestLog;
	static explicitErrorLog = EnvVariables.explicitErrorLog;
}

export default Config;
