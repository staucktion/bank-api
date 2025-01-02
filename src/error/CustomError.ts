import ErrorDto from "src/dto/error/ErrorDto";

class CustomError {
	private static counter = 0;
	private readonly errorId: number;
	private readonly errorType: string;
	private readonly error: any;
	private readonly stackTrace: string;
	private readonly message: string;

	private constructor(errorType: string, error: Error, message: string) {
		this.errorId = CustomError.counter++;
		this.errorType = errorType;
		this.stackTrace = new Error().stack;
		this.error = error;
		this.message = message;
	}

	public static builder() {
		return new this.Builder();
	}

	public getBody(): ErrorDto {
		const errorBody: any = {
			errorId: this.errorId,
			errorType: this.errorType,
			stackTrace: this.stackTrace,
			message: this.message,
		};

		if (this.error?.response) {
			errorBody.response = this.error.response.data;
		}

		if (this.error?.code) {
			errorBody.errorCode = this.error.code;
		}

		return errorBody;
	}

	public getMessage(): string {
		return this.message;
	}

	public log() {
		console.error("[ERROR]");
		console.error(this.getBody());
	}

	public throwError() {
		throw this;
	}

	// nested builder class
	private static Builder = class {
		private errorType: string;
		private error: Error;
		private message: string;

		public setErrorType(errorType: string): this {
			this.errorType = errorType;
			return this;
		}

		public setError(error: Error): this {
			this.error = error;
			return this;
		}

		public setMessage(message: string): this {
			this.message = message;
			return this;
		}

		public build(): CustomError {
			return new CustomError(this.errorType, this.error, this.message);
		}
	};
}

export default CustomError;
