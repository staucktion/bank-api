import express, { Router } from "express";
import BankFacade from "src/facade/bank/BankFacade";

class BankEndpoint {
	private router: Router;
	private bankFacade: BankFacade;

	constructor() {
		this.router = express.Router();
		this.bankFacade = new BankFacade();
		this.initializeRoutes();
	}

	private initializeRoutes(): void {
		this.router.post("/account", async (req, res) => {
			return await this.bankFacade.getAccountFromCard(req, res);
		});

		this.router.get("/auditlog", async (req, res) => {
			return await this.bankFacade.getAllAuditLog(req, res);
		});
	}

	public getRouter(): Router {
		return this.router;
	}
}

export default BankEndpoint;
