import dotenv from "dotenv";
dotenv.config();

class EnvVariables {
	static port = process.env.PORT || 80;
	static mode = process.env.MODE || "dev";
	static requestLog = process.env.REQUEST_LOG === "true";
	static explicitErrorLog = process.env.EXPLICIT_ERROR_LOG === "true";
}

export default EnvVariables;
