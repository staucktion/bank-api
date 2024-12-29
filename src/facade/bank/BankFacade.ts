import { account } from "@prisma/client";
import BankService from "src/service/bank/BankService";
import BankValidation from "src/validation/bank/BankValidation";

class BankFacade {
	private bankValidation: BankValidation;
	private bankService: BankService;

	constructor() {
		this.bankValidation = new BankValidation();
		this.bankService = new BankService();
	}

	getAccountFromCard = async (req, res) => {
		let cardNumber: string, expirationDate: string, cvv: string;

		// get valid body from request
		try {
			({ cardNumber, expirationDate, cvv } = await this.bankValidation.getAccountFromCardRequest(req));
		} catch (e: any) {
			return res.status(400).send({ error: e.message });
		}

		// get account information
		let bankAccountInformation: account;
		try {
			bankAccountInformation = await this.bankService.getAccountFromCard(cardNumber, expirationDate, cvv);
		} catch (error: any) {
			return res.status(500).send(error.message);
		}

		// keep auditlog
		try {
			await this.bankService.writeAuditLog(`Bank account information for card number "${cardNumber}" is queried.`);
		} catch (error: any) {
			console.error(error.message);
		}

		// return response
		return res.status(200).send(bankAccountInformation);
	};

	getAllAuditLog = async (req, res) => {
		// get auditlog
		try {
			const allAuditLog = await this.bankService.getAllAuditLog();
			return res.status(200).send(allAuditLog);
		} catch (error: any) {
			return res.status(500).send(error.message);
		}
	};

	provision = async (req, res) => {
		let cardNumber: string, expirationDate: string, cvv: string, provision: number;

		// get valid body from request
		try {
			({ cardNumber, expirationDate, cvv, provision } = await this.bankValidation.provisionRequest(req));
		} catch (e: any) {
			return res.status(400).send({ error: e.message });
		}

		// get account information
		let bankAccountInformation: account;
		try {
			bankAccountInformation = await this.bankService.getAccountFromCard(cardNumber, expirationDate, cvv);
		} catch (error: any) {
			return res.status(500).send(error.message);
		}

		// validate balance for provision
		try {
			await this.bankValidation.checkBalanceForProvision(bankAccountInformation, provision);
		} catch (e: any) {
			return res.status(400).send({ error: e.message });
		}

		// make provision
		try {
			await this.bankService.provision(bankAccountInformation, provision);
		} catch (error: any) {
			return res.status(500).send(error.message);
		}

		// keep auditlog
		try {
			await this.bankService.writeAuditLog(`"${provision}" provision made for the account with card number: "${cardNumber}".`);
		} catch (error: any) {
			console.error(error.message);
		}

		// return success
		res.status(200).send();
	};
}

export default BankFacade;