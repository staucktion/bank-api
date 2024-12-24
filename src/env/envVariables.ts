import dotenv from "dotenv";
dotenv.config();

class EnvVairables {
  static port = process.env.PORT || 80;
}

export default EnvVairables;
