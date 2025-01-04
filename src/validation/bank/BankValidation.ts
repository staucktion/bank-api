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

		// validate request body
		try {
			ValidationUtil.checkObjectExistence(cardDto);
		} catch (error: any) {
			if (error instanceof CustomError) CustomError.builder().setMessage("Request body is required.").setErrorType("Input Validation").setStatusCode(400).build().throwError();
		}

		// validate required fields
		try {
			ValidationUtil.checkRequiredFields(requiredFields, cardDto);
		} catch (error: any) {
			if (error instanceof CustomError)
				CustomError.builder().setMessage(`Request body is invalid. ${error.getBody().externalMessage}`).setErrorType("Input Validation").setStatusCode(400).build().throwError();
		}

		return cardDto;
	}

	public async provisionRequest(req: any): Promise<ProvisionDto> {
		const provisionDto: ProvisionDto = req.body;
		const requiredFields: string[] = ["cardNumber", "expirationDate", "cvv", "provision"];
		const numericFields = ["provision"];

		// validate request body
		try {
			ValidationUtil.checkObjectExistence(provisionDto);
		} catch (error: any) {
			if (error instanceof CustomError) CustomError.builder().setMessage("Request body is required.").setErrorType("Input Validation").setStatusCode(400).build().throwError();
		}

		// validate required fields
		try {
			ValidationUtil.checkRequiredFields(requiredFields, provisionDto);
		} catch (error: any) {
			if (error instanceof CustomError)
				CustomError.builder().setMessage(`Request body is invalid. ${error.getBody().externalMessage}`).setErrorType("Input Validation").setStatusCode(400).build().throwError();
		}

		// validate numeric fields
		try {
			ValidationUtil.validateNumericFieldsOfObject(numericFields, provisionDto);
		} catch (error: any) {
			if (error instanceof CustomError)
				CustomError.builder().setMessage(`Request body is invalid. ${error.getBody().externalMessage}`).setErrorType("Input Validation").setStatusCode(400).build().throwError();
		}

		// assign numeric fields
		ValidationUtil.assignNumericFieldsOnObject(numericFields, provisionDto);

		return provisionDto;
	}

	public async makeTransactionRequest(req: Request): Promise<TransactionDto> {
		const transactionDto: TransactionDto = req.body;
		const requiredFields: string[] = ["senderCardNumber", "senderExpirationDate", "senderCvv", "targetCardNumber", "amount"];
		const numericFields = ["amount"];

		// validate request body
		try {
			ValidationUtil.checkObjectExistence(transactionDto);
		} catch (error: any) {
			if (error instanceof CustomError) CustomError.builder().setMessage("Request body is required.").setErrorType("Input Validation").setStatusCode(400).build().throwError();
		}

		// validate required fields
		try {
			ValidationUtil.checkRequiredFields(requiredFields, transactionDto);
		} catch (error: any) {
			if (error instanceof CustomError)
				CustomError.builder().setMessage(`Request body is invalid. ${error.getBody().externalMessage}`).setErrorType("Input Validation").setStatusCode(400).build().throwError();
		}

		// validate numeric fields
		try {
			ValidationUtil.validateNumericFieldsOfObject(numericFields, transactionDto);
		} catch (error: any) {
			if (error instanceof CustomError)
				CustomError.builder().setMessage(`Request body is invalid. ${error.getBody().externalMessage}`).setErrorType("Input Validation").setStatusCode(400).build().throwError();
		}

		// assign numeric fields
		ValidationUtil.assignNumericFieldsOnObject(numericFields, transactionDto);

		return transactionDto;
	}

	public async checkAccount(bankAccountInformation: account): Promise<void> {
		const requiredFields: string[] = ["id", "balance"];

		// validate bank account is exist
		try {
			ValidationUtil.checkObjectExistence(bankAccountInformation);
		} catch (error: any) {
			if (error instanceof CustomError) CustomError.builder().setMessage("Invalid credentials.").setErrorType("Input Validation").setStatusCode(400).build().throwError();
		}

		// check required fields
		try {
			ValidationUtil.checkRequiredFields(requiredFields, bankAccountInformation);
		} catch (error: any) {
			if (error instanceof CustomError)
				if (error instanceof CustomError) CustomError.builder().setMessage("Invalid credentials.").setErrorType("Input Validation").setStatusCode(400).build().throwError();
		}
	}

	public async transactionAmount(senderAccountInformation: account, amount: number): Promise<void> {
		const requiredFields: string[] = ["id", "balance"];

		// validate bank account is exist
		try {
			ValidationUtil.checkObjectExistence(senderAccountInformation);
		} catch (error: any) {
			if (error instanceof CustomError) CustomError.builder().setMessage("Invalid credentials.").setErrorType("Input Validation").setStatusCode(400).build().throwError();
		}

		// check required fields
		try {
			ValidationUtil.checkRequiredFields(requiredFields, senderAccountInformation);
		} catch (error: any) {
			if (error instanceof CustomError)
				if (error instanceof CustomError) CustomError.builder().setMessage("Invalid credentials.").setErrorType("Input Validation").setStatusCode(400).build().throwError();
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
