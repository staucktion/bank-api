import { account } from "@prisma/client";
import CardDto from "src/dto/bank/CardDto";
import ProvisionDto from "src/dto/bank/ProvisionDto";
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
		let cardDto: CardDto;

		// get valid body from request
		try {
			cardDto = await this.bankValidation.getAccountFromCardRequest(req);
		} catch (error: any) {
			if (error instanceof CustomError) {
				return res.status(error.getStatusCode()).send(error.getMessage());
			}
		}

		// get account information
		let bankAccountInformation: account;
		try {
			bankAccountInformation = await this.bankService.getAccountFromCard(cardDto.cardNumber, cardDto.expirationDate, cardDto.cvv);
		} catch (error: any) {
			if (error instanceof CustomError) {
				error.log();
				return res.status(error.getStatusCode()).send(error.getMessage());
			}
		}

		// keep auditlog
		try {
			await this.bankService.writeAuditLog(`Bank account information for card number "${cardDto.cardNumber}" is queried.`);
		} catch (error: any) {
			if (error instanceof CustomError) {
				error.log();
			}
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
			if (error instanceof CustomError) {
				return res.status(error.getStatusCode()).send(error.getMessage());
			}
		}
	};

	addProvision = async (req, res) => {
		let provisionDto: ProvisionDto;

		// get valid body from request
		try {
			provisionDto = await this.bankValidation.provisionRequest(req);
		} catch (error: any) {
			if (error instanceof CustomError) {
				return res.status(error.getStatusCode()).send(error.getMessage());
			}
		}

		// get account information
		let bankAccountInformation: account;
		try {
			bankAccountInformation = await this.bankService.getAccountFromCard(provisionDto.cardNumber, provisionDto.expirationDate, provisionDto.cvv);
		} catch (error: any) {
			if (error instanceof CustomError) {
				error.log();
				return res.status(error.getStatusCode()).send(error.getMessage());
			}
		}

		// validate account
		try {
			await this.bankValidation.checkAccount(bankAccountInformation);
		} catch (error: any) {
			if (error instanceof CustomError) {
				error.log();
				return res.status(error.getStatusCode()).send(error.getMessage());
			}
		}

		// validate balance for provision
		try {
			await this.bankValidation.checkBalanceToAddProvision(bankAccountInformation, provisionDto.provision);
		} catch (error: any) {
			if (error instanceof CustomError) {
				return res.status(error.getStatusCode()).send(error.getMessage());
			}
		}

		// make provision
		try {
			await this.bankService.addProvision(bankAccountInformation, provisionDto.provision);
		} catch (error: any) {
			if (error instanceof CustomError) {
				error.log();
				return res.status(error.getStatusCode()).send(error.getMessage());
			}
		}

		// keep auditlog
		try {
			await this.bankService.writeAuditLog(`"${provisionDto.provision}" provision made for the account with card number: "${provisionDto.cardNumber}".`);
		} catch (error: any) {
			if (error instanceof CustomError) {
				error.log();
				return res.status(error.getStatusCode()).send(error.getMessage());
			}
		}

		// return success
		res.status(200).send();
	};

	removeProvision = async (req, res) => {
		let provisionDto: ProvisionDto;

		// get valid body from request
		try {
			provisionDto = await this.bankValidation.provisionRequest(req);
		} catch (error: any) {
			if (error instanceof CustomError) {
				return res.status(error.getStatusCode()).send(error.getMessage());
			}
		}

		// get account information
		let bankAccountInformation: account;
		try {
			bankAccountInformation = await this.bankService.getAccountFromCard(provisionDto.cardNumber, provisionDto.expirationDate, provisionDto.cvv);
		} catch (error: any) {
			if (error instanceof CustomError) {
				error.log();
				return res.status(error.getStatusCode()).send(error.getMessage());
			}
		}

		// validate account
		try {
			await this.bankValidation.checkAccount(bankAccountInformation);
		} catch (error: any) {
			if (error instanceof CustomError) {
				error.log();
				return res.status(error.getStatusCode()).send(error.getMessage());
			}
		}

		// validate balance for provision
		try {
			await this.bankValidation.checkProvisionToRemove(bankAccountInformation, provisionDto.provision);
		} catch (error: any) {
			if (error instanceof CustomError) {
				return res.status(error.getStatusCode()).send(error.getMessage());
			}
		}

		// remove provision
		try {
			await this.bankService.removeProvision(bankAccountInformation, provisionDto.provision);
		} catch (error: any) {
			if (error instanceof CustomError) {
				error.log();
				return res.status(error.getStatusCode()).send(error.getMessage());
			}
		}

		// keep auditlog
		try {
			await this.bankService.writeAuditLog(`"${provisionDto.provision}" provision removed for the account with card number: "${provisionDto.cardNumber}".`);
		} catch (error: any) {
			if (error instanceof CustomError) {
				error.log();
				return res.status(error.getStatusCode()).send(error.getMessage());
			}
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
				return res.status(error.getStatusCode()).send(error.getMessage());
			}
		}

		// get sender account information
		let senderAccountInformation: account;
		try {
			senderAccountInformation = await this.bankService.getAccountFromCard(transactionDto.senderCardNumber, transactionDto.senderExpirationDate, transactionDto.senderCvv);
		} catch (error: any) {
			if (error instanceof CustomError) {
				error.log();
				return res.status(error.getStatusCode()).send(error.getMessage());
			}
		}

		// get target account information
		let targetAccountInformation: account;
		try {
			targetAccountInformation = await this.bankService.getAccountFromCardNumber(transactionDto.targetCardNumber);
		} catch (error: any) {
			if (error instanceof CustomError) {
				error.log();
				return res.status(error.getStatusCode()).send(error.getMessage());
			}
		}

		// validate accounts
		try {
			await this.bankValidation.checkAccount(senderAccountInformation);
			await this.bankValidation.checkAccount(targetAccountInformation);
		} catch (error: any) {
			if (error instanceof CustomError) {
				return res.status(error.getStatusCode()).send(error.getMessage());
			}
		}

		// validate transaction amount
		try {
			await this.bankValidation.transactionAmount(senderAccountInformation, transactionDto.amount);
		} catch (error: any) {
			if (error instanceof CustomError) {
				return res.status(error.getStatusCode()).send(error.getMessage());
			}
		}

		// make transaction
		try {
			await this.bankService.makeTransaction(senderAccountInformation, targetAccountInformation, transactionDto.amount, transactionDto.description);
		} catch (error: any) {
			if (error instanceof CustomError) {
				return res.status(error.getStatusCode()).send(error.getMessage());
			}
		}

		// keep auditlog
		try {
			await this.bankService.writeAuditLog(
				`Transaction of amount "${transactionDto.amount}" completed from account with card number: "${transactionDto.senderCardNumber}" to account with card number: "${transactionDto.targetCardNumber}".`
			);
		} catch (error: any) {
			if (error instanceof CustomError) {
				error.log();
			}
		}

		// return success
		res.status(200).send();
	};
}

export default BankFacade;
