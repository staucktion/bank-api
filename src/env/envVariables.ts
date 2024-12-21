import dotenv from "dotenv";
dotenv.config();

const envVariables = {
  PORT: process.env.PORT || 8080,
};

export default envVariables;
