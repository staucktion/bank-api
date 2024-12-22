import express from "express";
import setupRoutes from "./src/route/route";
import envVariables from "src/env/envVariables";

const app = express();

// parse json request body
app.use(express.json()); 

// route
setupRoutes(app);

// serve
app.listen(envVariables.PORT, () => {
  console.log(`API running at: http://localhost:${envVariables.PORT}`);
});
