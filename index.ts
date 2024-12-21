import express from "express";
import setupRoutes from "./src/route/route";
import envVariables from "src/env/envVariables";

const app = express();

// route
setupRoutes(app);

// serve
app.listen(envVariables.PORT, () => {
  console.log(`API running at: http://localhost:${envVariables.PORT}`);
});
