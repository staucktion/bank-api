import { account } from "@prisma/client";
import CustomError from "src/error/CustomError";

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

	public async checkBalanceForProvision(bankAccountInformation: account, offeredProvision: number): Promise<void> {
		// check field
		if (!bankAccountInformation || !bankAccountInformation.balance || !bankAccountInformation.provision) {
			CustomError.builder()
				.setErrorType("Input Validation Error")
				.setClassName(this.constructor.name)
				.setMethodName("checkBalanceForProvision")
				.setMessage("valid bank card credentials required")
				.build()
				.throwError();
		}

		// check balance for provision
		if (offeredProvision > bankAccountInformation.balance.toNumber()) {
			CustomError.builder()
				.setErrorType("Client Error")
				.setClassName(this.constructor.name)
				.setMethodName("checkBalanceForProvision")
				.setMessage("not enough balance for provision")
				.build()
				.throwError();
		}
	}
}

export default BankValidation;
