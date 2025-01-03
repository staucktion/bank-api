export default interface ErrorDto {
	errorId: number;
	errorType: string;
	stackTrace: string;
	message: string;
	response?: any;
	errorCode?: string;
}
