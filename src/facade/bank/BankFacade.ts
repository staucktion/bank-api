import { account } from "@prisma/client";
import TransactionDto from "src/dto/bank/TransactionDto";
import CustomError from "src/error/CustomError";
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

	addProvision = async (req, res) => {
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
			await this.bankValidation.checkBalanceToAddProvision(bankAccountInformation, provision);
		} catch (e: any) {
			return res.status(400).send({ error: e.message });
		}

		// make provision
		try {
			await this.bankService.addProvision(bankAccountInformation, provision);
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

	removeProvision = async (req, res) => {
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

		// validate provision
		try {
			await this.bankValidation.checkProvisionToRemove(bankAccountInformation, provision);
		} catch (e: any) {
			return res.status(400).send({ error: e.message });
		}

		// remove provision
		try {
			await this.bankService.removeProvision(bankAccountInformation, provision);
		} catch (error: any) {
			return res.status(500).send(error.message);
		}

		// keep auditlog
		try {
			await this.bankService.writeAuditLog(`"${provision}" provision removed for the account with card number: "${cardNumber}".`);
		} catch (error: any) {
			console.error(error.message);
		}

		// return success
		res.status(200).send();
	};

	makeTransaction = async (req, res) => {
		let transactionDto: TransactionDto;

		// get valid body from request
		try {
			transactionDto = await this.bankValidation.makeTransactionRequest(req);
		} catch (error: any) {
			if (error instanceof CustomError) {
				return res.status(400).send({ message: error.getMessage() });
			}
		}

		// get sender account information
		let senderAccountInformation: account;
		try {
			senderAccountInformation = await this.bankService.getAccountFromCard(transactionDto.senderCardNumber, transactionDto.senderExpirationDate, transactionDto.senderCvv);
		} catch (error: any) {
			// todo error log buralara eklenlei
			return res.status(500).send(error.message);
		}

		// get target account information
		let targetAccountInformation: account;
		try {
			targetAccountInformation = await this.bankService.getAccountFromCardNumber(transactionDto.targetCardNumber);
		} catch (error: any) {
			return res.status(500).send(error.message);
		}

		// validate accounts
		try {
			await this.bankValidation.checkAccountExistence(senderAccountInformation);
			await this.bankValidation.checkAccountExistence(targetAccountInformation);
		} catch (e: any) {
			return res.status(400).send({ error: e.message });
		}

		// validate transaction amount
		try {
			await this.bankValidation.transactionAmount(senderAccountInformation, transactionDto.amount);
		} catch (e: any) {
			return res.status(400).send({ error: e.message });
		}

		// make transaction
		try {
			await this.bankService.makeTransaction(senderAccountInformation, targetAccountInformation, transactionDto.amount);
		} catch (error: any) {
			return res.status(500).send(error.message);
		}

		// keep auditlog
		try {
			await this.bankService.writeAuditLog(
				`Transaction of amount "${transactionDto.amount}" completed from account with card number: "${transactionDto.senderCardNumber}" to account with card number: "${transactionDto.targetCardNumber}".`
			);
		} catch (error: any) {
			console.error(error.message);
		}

		// return success
		res.status(200).send();
	};
}

export default BankFacade;
