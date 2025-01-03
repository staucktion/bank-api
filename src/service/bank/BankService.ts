import { account, auditlog, PrismaClient } from "@prisma/client";
import CustomError from "src/error/CustomError";
import PrismaUtil from "src/util/PrismaUtil";

class BankService {
	private prisma: PrismaClient;

	constructor() {
		this.prisma = PrismaUtil.getPrismaClient();
	}

	public async getAccountFromCard(cardNumber: string, expirationDate: string, cvv: string): Promise<account | null> {
		try {
			const account = await this.prisma.account.findFirst({
				where: {
					cards: {
						some: {
							number: cardNumber,
							expiration_date: expirationDate,
							cvv: cvv,
						},
					},
				},
				select: {
					id: true,
					balance: true,
					created_at: true,
					updated_at: true,
					provision: true,
					cards: true,
				},
			});

			return account;
		} catch (error: any) {
			CustomError.builder().setErrorType("Prisma Error").setStatusCode(500).setExternalMessage(error.message).setMessage("Cannot perform database operation.").build().throwError();
		}
	}

	public async getAccountFromCardNumber(cardNumber: string): Promise<account | null> {
		try {
			const account = await this.prisma.account.findFirst({
				where: {
					cards: {
						some: {
							number: cardNumber,
						},
					},
				},
				select: {
					id: true,
					balance: true,
					created_at: true,
					updated_at: true,
					provision: true,
					cards: true,
				},
			});

			return account;
		} catch (error: any) {
			CustomError.builder().setErrorType("Prisma Error").setStatusCode(500).setExternalMessage(error.message).setMessage("Cannot perform database operation.").build().throwError();
		}
	}

	public async writeAuditLog(action: string): Promise<auditlog | null> {
		try {
			const newAuditLog = await this.prisma.auditlog.create({
				data: {
					action: action,
				},
			});

			return newAuditLog;
		} catch (error: any) {
			CustomError.builder().setErrorType("Prisma Error").setStatusCode(500).setExternalMessage(error.message).setMessage("Cannot perform database operation.").build().throwError();
		}
	}

	public async getAllAuditLog(): Promise<auditlog[] | null> {
		try {
			const auditLogs = await this.prisma.auditlog.findMany();
			return auditLogs;
		} catch (error: any) {
			CustomError.builder().setErrorType("Prisma Error").setStatusCode(500).setExternalMessage(error.message).setMessage("Cannot perform database operation.").build().throwError();
		}
	}

	public async addProvision(bankAccountInformation: account, provision: number): Promise<void> {
		try {
			await this.prisma.account.update({
				where: {
					id: bankAccountInformation.id,
				},
				data: {
					balance: bankAccountInformation.balance.toNumber() - provision,
					provision: bankAccountInformation.provision.toNumber() + provision,
				},
			});
		} catch (error: any) {
			CustomError.builder().setErrorType("Prisma Error").setStatusCode(500).setExternalMessage(error.message).setMessage("Cannot perform database operation.").build().throwError();
		}
	}

	public async removeProvision(bankAccountInformation: account, provision: number): Promise<void> {
		try {
			await this.prisma.account.update({
				where: {
					id: bankAccountInformation.id,
				},
				data: {
					balance: bankAccountInformation.balance.toNumber() + provision,
					provision: bankAccountInformation.provision.toNumber() - provision,
				},
			});
		} catch (error: any) {
			CustomError.builder().setErrorType("Prisma Error").setStatusCode(500).setExternalMessage(error.message).setMessage("Cannot perform database operation.").build().throwError();
		}
	}

	public async makeTransaction(senderAccountInformation: account, targetAccountInformation: account, amount: number, description): Promise<void> {
		try {
			await this.prisma.$transaction(async (prisma) => {
				await prisma.account.update({
					where: {
						id: senderAccountInformation.id,
					},
					data: {
						balance: senderAccountInformation.balance.toNumber() - amount,
					},
				});

				await prisma.account.update({
					where: {
						id: targetAccountInformation.id,
					},
					data: {
						balance: targetAccountInformation.balance.toNumber() + amount,
					},
				});

				await prisma.transaction.create({
					data: {
						sender_account_id: senderAccountInformation.id,
						receiver_account_id: targetAccountInformation.id,
						amount: amount,
						description: description,
					},
				});
			});
		} catch (error: any) {
			CustomError.builder().setErrorType("Prisma Error").setStatusCode(500).setExternalMessage(error.message).setMessage("Cannot perform database operation.").build().throwError();
		}
	}
}

export default BankService;
