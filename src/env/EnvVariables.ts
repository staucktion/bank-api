import dotenv from "dotenv";
dotenv.config();

class EnvVariables {
	static port: number = parseInt(process.env.PORT);
	static mode: string = process.env.MODE;
	static requestLog: boolean = Boolean(process.env.REQUEST_LOG);
	static explicitErrorLog: boolean = Boolean(process.env.REQUEST_LOG);
}

export default EnvVariables;
