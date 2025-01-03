import dotenv from "dotenv";
dotenv.config();

class EnvVariables {
	static port = process.env.PORT || 80;
	static mode = process.env.MODE || "dev";
	static log = process.env.LOG === "true";
}

export default EnvVariables;
