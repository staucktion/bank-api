import { account } from "@prisma/client";
import { Request } from "express";
import CardDto from "src/dto/bank/CardDto";
import ProvisionDto from "src/dto/bank/ProvisionDto";
import TransactionDto from "src/dto/bank/TransactionDto";
import CustomError from "src/error/CustomError";
import ValidationUtil from "src/util/ValidationUtil";

class BankValidation {
	public async getAccountFromCardRequest(req: Request): Promise<CardDto> {
		const cardDto: CardDto = req.body;
		const requiredFields: string[] = ["cardNumber", "expirationDate", "cvv"];

		// validate required fields
		try {
			ValidationUtil.checkRequiredFields(requiredFields, cardDto);
		} catch (error: any) {
			throw error;
		}

		return cardDto;
	}

	public async provisionRequest(req: any): Promise<ProvisionDto> {
		const provisionDto: ProvisionDto = req.body;
		const requiredFields: string[] = ["cardNumber", "expirationDate", "cvv", "provision"];
		const numericFields = ["provision"];

		// validate required fields
		try {
			ValidationUtil.checkRequiredFields(requiredFields, provisionDto);
		} catch (error: any) {
			throw error;
		}

		// validate numeric fields
		try {
			ValidationUtil.validateNumericFields(numericFields, provisionDto);
		} catch (error: any) {
			throw error;
		}

		// assign numeric fields
		ValidationUtil.assignNumericFields(numericFields, provisionDto);

		return provisionDto;
	}

	public async makeTransactionRequest(req: Request): Promise<TransactionDto> {
		const transactionDto: TransactionDto = req.body;
		const requiredFields: string[] = ["senderCardNumber", "senderExpirationDate", "senderCvv", "targetCardNumber", "amount"];
		const numericFields = ["amount"];

		// validate required fields
		try {
			ValidationUtil.checkRequiredFields(requiredFields, transactionDto);
		} catch (error: any) {
			throw error;
		}

		// validate numeric fields
		try {
			ValidationUtil.validateNumericFields(numericFields, transactionDto);
		} catch (error: any) {
			throw error;
		}

		// assign numeric fields
		ValidationUtil.assignNumericFields(numericFields, transactionDto);

		return transactionDto;
	}

	public async checkAccount(bankAccountInformation: account): Promise<void> {
		const requiredFields: string[] = ["id", "balance"];

		// validate object existence
		try {
			ValidationUtil.checkExistence(bankAccountInformation);
		} catch (error: any) {
			throw error;
		}

		// validate required fields
		try {
			ValidationUtil.checkRequiredFields(requiredFields, bankAccountInformation);
		} catch (error: any) {
			throw error;
		}
	}

	public async transactionAmount(senderAccountInformation: account, amount: number): Promise<void> {
		// check field
		if (!senderAccountInformation || !senderAccountInformation.balance) {
			CustomError.builder().setErrorType("Input Validation").setStatusCode(400).setMessage("Invalid card details").build().throwError();
		}

		// check balance for sufficiency
		if (senderAccountInformation.balance.toNumber() < amount) {
			CustomError.builder().setErrorType("Input Validation").setStatusCode(400).setMessage("Balance is not sufficient for transaction.").build().throwError();
		}
	}

	public async checkBalanceToAddProvision(bankAccountInformation: account, offeredProvision: number): Promise<void> {
		// check balance for sufficiency
		if (offeredProvision > bankAccountInformation.balance.toNumber()) {
			CustomError.builder().setErrorType("Input Validation").setStatusCode(400).setMessage("Balance is not sufficient for provision.").build().throwError();
		}
	}

	public async checkProvisionToRemove(bankAccountInformation: account, offeredProvision: number): Promise<void> {
		// check balance for provision
		if (offeredProvision > bankAccountInformation.provision.toNumber()) {
			CustomError.builder().setErrorType("Input Validation").setStatusCode(400).setMessage("Account provision is not sufficient to remove that much provision.").build().throwError();
		}
	}
}

export default BankValidation;
