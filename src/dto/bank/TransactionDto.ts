export default interface TransactionDto {
	senderCardNumber: string;
	senderExpirationDate: string;
	senderCvv: string;
	targetCardNumber: string;
	amount: number;
}
