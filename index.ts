import express from "express";
import Config from "src/config/Config";
import setupRoutes from "./src/route/route";

const app = express();

// parse json request body
app.use(express.json());

// route
setupRoutes(app);

// serve
app.listen(Config.port, () => {
  console.log("🚀🚀🚀");
  console.log(`API launched on: http://localhost:${Config.port}`);
});
