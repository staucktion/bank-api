export default interface ErrorDto {
	errorId: number;
	errorType: string;
	stackTrace: string;
	message: string;
	statusCode: number;
	externalMessage: string;
}
