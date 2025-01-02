import { account } from "@prisma/client";
import { Request } from "express";
import TransactionDto from "src/dto/bank/TransactionDto";
import CustomError from "src/error/CustomError";
import ValidationUtil from "src/util/ValidationUtil";

class BankValidation {
	public async getAccountFromCardRequest(req: any): Promise<{ cardNumber: string; expirationDate: string; cvv: string }> {
		const { cardNumber, expirationDate, cvv } = req.body;

		if (!cardNumber || !expirationDate || !cvv) {
			CustomError.builder()
				.setErrorType("Input Validation Error")
				.setClassName(this.constructor.name)
				.setMethodName("getAccountFromCardRequest")
				.setMessage("cardNumber, expirationDate, and cvv required")
				.build()
				.throwError();
		}

		return { cardNumber, expirationDate, cvv };
	}

	public async provisionRequest(req: any): Promise<{ cardNumber: string; expirationDate: string; cvv: string; provision: number }> {
		let { cardNumber, expirationDate, cvv, provision } = req.body;

		// check required fields
		if (!cardNumber || !expirationDate || !cvv || !provision) {
			CustomError.builder()
				.setErrorType("Input Validation Error")
				.setClassName(this.constructor.name)
				.setMethodName("getAccountFromCardRequest")
				.setMessage("cardNumber, expirationDate, cvv, and provision required")
				.build()
				.throwError();
		}

		// convert numeric field
		provision = parseFloat(provision);

		// check data type
		if (isNaN(provision)) {
			CustomError.builder()
				.setErrorType("Input Validation Error")
				.setClassName(this.constructor.name)
				.setMethodName("getAccountFromCardRequest")
				.setMessage("provision should be numeric")
				.build()
				.throwError();
		}

		return { cardNumber, expirationDate, cvv, provision };
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

	public async checkAccountExistence(bankAccountInformation: account): Promise<void> {
		// check field
		if (!bankAccountInformation || !bankAccountInformation.id) {
			CustomError.builder().setErrorType("Input Validation").setMessage("Invalid card details").build().throwError();
		}
	}

	public async transactionAmount(senderAccountInformation: account, amount: number): Promise<void> {
		// check field
		if (!senderAccountInformation || !senderAccountInformation.balance) {
			CustomError.builder().setErrorType("Input Validation").setMessage("Invalid card details").build().throwError();
		}

		// check balance for sufficiency
		if (senderAccountInformation.balance.toNumber() < amount) {
			CustomError.builder().setErrorType("Input Validation Error").setMessage("Balance is not sufficient for transaction.").build().throwError();
		}
	}

	public async checkBalanceToAddProvision(bankAccountInformation: account, offeredProvision: number): Promise<void> {
		// check field
		if (!bankAccountInformation || !bankAccountInformation.balance || !bankAccountInformation.provision) {
			CustomError.builder()
				.setErrorType("Input Validation Error")
				.setClassName(this.constructor.name)
				.setMethodName("checkBalanceToAddProvision")
				.setMessage("valid bank card credentials required")
				.build()
				.throwError();
		}

		// check balance for provision
		if (offeredProvision > bankAccountInformation.balance.toNumber()) {
			CustomError.builder()
				.setErrorType("Client Error")
				.setClassName(this.constructor.name)
				.setMethodName("checkBalanceToAddProvision")
				.setMessage("not enough balance to provision")
				.build()
				.throwError();
		}
	}

	public async checkProvisionToRemove(bankAccountInformation: account, offeredProvision: number): Promise<void> {
		// check field
		if (!bankAccountInformation || !bankAccountInformation.balance || !bankAccountInformation.provision) {
			CustomError.builder()
				.setErrorType("Input Validation Error")
				.setClassName(this.constructor.name)
				.setMethodName("checkProvisionToRemove")
				.setMessage("valid bank card credentials required")
				.build()
				.throwError();
		}

		// check balance for provision
		if (offeredProvision > bankAccountInformation.provision.toNumber()) {
			CustomError.builder()
				.setErrorType("Client Error")
				.setClassName(this.constructor.name)
				.setMethodName("checkProvisionToRemove")
				.setMessage("not enough provision to remove")
				.build()
				.throwError();
		}
	}
}

export default BankValidation;
