import healthRouter from "../endpoint/health/healthRouter";
import bankRouter from "../endpoint/bank/bankRouter";

const setupRoutes = (app) => {
  app.use(healthRouter);
  app.use(bankRouter);
};

export default setupRoutes;
