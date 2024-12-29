import express from "express";
import BankEndpoint from "src/endpoint/bank/BankEndpoint";
import HealthEndpoint from "src/endpoint/health/HealthEndpoint";

class Router {
	private healthEndpoint: HealthEndpoint;
	private bankEndpoint: BankEndpoint;

	constructor() {
		this.healthEndpoint = new HealthEndpoint();
		this.bankEndpoint = new BankEndpoint();
	}

	public setupRoute(app: express.Application): void {
		app.use(this.healthEndpoint.getRouter());
		app.use(this.bankEndpoint.getRouter());
	}
}

export default Router;
