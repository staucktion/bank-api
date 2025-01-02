import TransactionDto from "src/dto/bank/TransactionDto";
import CustomError from "src/error/CustomError";

class ValidationUtil {
	public static checkRequiredFields(requiredFields: string[], dto) {
		const missingFields = requiredFields.filter((field) => dto[field] === undefined || dto[field] === null || dto[field] === "");

		if (missingFields.length !== 0) {
			CustomError.builder().setErrorType("Input Validation").setMessage(`Missing request fields: ${missingFields}`).build().throwError();
		}
	}

	public static validateNumericFields(numericFields: string[], dto) {
		const invalidFields = numericFields.filter((field) => isNaN(Number(dto[field])));

		if (invalidFields.length !== 0) {
			CustomError.builder().setErrorType("Input Validation").setMessage(`Invalid numeric fields: ${invalidFields}`).build().throwError();
		}
	}

	public static assignNumericFields(numericFields: string[], dto) {
		numericFields.map((field) => (dto[field] = Number(dto[field])));
	}
}

export default ValidationUtil;
