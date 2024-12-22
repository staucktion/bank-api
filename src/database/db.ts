import pkg from "pg";
const { Pool } = pkg;
import envVariables from "src/env/envVariables";

console.log("creating pool");
// Create a connection pool
const pool = new Pool({
  user: envVariables.DBUSERNAME,
  host: envVariables.DBHOST,
  database: envVariables.DBDATABASE,
  password: envVariables.DBPGPASSWORD,
  port: 5432,
});

export default pool;
