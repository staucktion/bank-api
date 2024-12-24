import dotenv from "dotenv";
dotenv.config();

class EnvVairables {
  static port = process.env.PORT || 80;
  static mode = process.env.MODE || "dev";
}

export default EnvVairables;
