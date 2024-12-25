import express, { Application } from "express";
import Config from "src/config/Config";
import Router from "src/router/Router";

class App {
  private app: Application;
  private router: Router;

  constructor() {
    this.app = express();
    this.router = new Router();
    this.initializeMiddlewares();
    this.initializeRoutes();
  }

  private initializeMiddlewares(): void {
    // parse JSON request body
    this.app.use(express.json());
  }

  private initializeRoutes(): void {
    // setup routes
    this.router.setupRoute(this.app);
  }

  public listen(): void {
    const port = Config.port;
    this.app.listen(port, () => {
      console.log("🚀🚀🚀");
      console.log(`API launched on: http://localhost:${port}`);
    });
  }
}

export default App;
