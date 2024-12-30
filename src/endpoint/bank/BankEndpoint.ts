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
		this.router.post("/accounts", async (req, res) => {
			return await this.bankFacade.getAccountFromCard(req, res);
		});

		this.router.get("/auditlogs", async (req, res) => {
			return await this.bankFacade.getAllAuditLog(req, res);
		});

		this.router.put("/provisions/add", async (req, res) => {
			return await this.bankFacade.addProvision(req, res);
		});

		this.router.put("/provisions/remove", async (req, res) => {
			return await this.bankFacade.removeProvision(req, res);
		});
	}

	public getRouter(): Router {
		return this.router;
	}
}

export default BankEndpoint;
