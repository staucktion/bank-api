import express, { Application } from "express";
import Config from "src/config/Config";
import Logger from "src/log/Logger";
import Router from "src/router/Router";
import PrismaUtil from "src/util/PrismaUtil";

class App {
  private app: Application;
  private router: Router;

  constructor() {
    this.app = express();
    this.router = new Router();
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializePrismaConnection();
  }

  private initializeMiddlewares(): void {
    // log incoming requests
    this.app.use(Logger.logRequest);

    // parse JSON request body
    this.app.use(express.json());
  }

  private initializeRoutes(): void {
    // setup routes
    this.router.setupRoute(this.app);
  }

  private initializePrismaConnection(): void {
    // initialize prisma client
    PrismaUtil.initalizePrismaClient();
  }

  public listen(): void {
    const port = Config.port;
    this.app.listen(port, () => {
      console.log("🚀🚀🚀");
      console.log(`API launched on: http://localhost:${port}`);
      console.log("🚀🚀🚀");
    });
  }
}

export default App;