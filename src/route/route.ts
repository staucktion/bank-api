import healthRouter from "../endpoint/health/healthRouter";

const setupRoutes = (app) => {
  app.use(healthRouter);
};

export default setupRoutes;
