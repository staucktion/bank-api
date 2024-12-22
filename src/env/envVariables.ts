import dotenv from "dotenv";
dotenv.config();

const envVariables = {
  PORT: process.env.PORT || 80,

  DBHOST: process.env.DBHOST,
  DBDATABASE: process.env.DBDATABASE,
  DBPGPASSWORD: process.env.DBPGPASSWORD,
  DBUSERNAME: process.env.DBUSERNAME,
};

export default envVariables;
