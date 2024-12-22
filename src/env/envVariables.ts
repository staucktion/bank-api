import dotenv from "dotenv";
dotenv.config();

const envVariables = {
  PORT: process.env.PORT || 80,
};

export default envVariables;
