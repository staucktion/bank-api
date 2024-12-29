import CustomError from "src/error/CustomError";

class BankValidation {
	public async getAccountFromCardRequest(req: any): Promise<{ cardNumber: string; expirationDate: string; cvv: string }> {
		const { cardNumber, expirationDate, cvv } = req.body;

		if (!cardNumber || !expirationDate || !cvv) {
			CustomError.builder()
				.setErrorType("Input Validation Error")
				.setClassName(this.constructor.name)
				.setMethodName("getAccountFromCardRequest")
				.setMessage("cardNumber, expirationDate, and cvv are required")
				.build()
				.throwError();
		}

		return { cardNumber, expirationDate, cvv };
	}
}

export default BankValidation;
