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
			CustomError.builder()
				.setErrorType("Prisma Error")
				.setClassName(this.constructor.name)
				.setMethodName("getAccountFromCard")
				.setError(error)
				.build()
				.throwError();
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
			CustomError.builder()
				.setErrorType("Prisma Error")
				.setClassName(this.constructor.name)
				.setMethodName("getAccountFromCard")
				.setError(error)
				.build()
				.throwError();
		}
	}

	public async getAllAuditLog(): Promise<auditlog[] | null> {
		try {
			const auditLogs = await this.prisma.auditlog.findMany();
			return auditLogs;
		} catch (error: any) {
			CustomError.builder()
				.setErrorType("Prisma Error")
				.setClassName(this.constructor.name)
				.setMethodName("getAllAuditLog")
				.setError(error)
				.build()
				.throwError();
		}
	}

	public async provision(bankAccountInformation: account, provision: number): Promise<void> {
		await this.prisma.account.update({
			where: {
				id: bankAccountInformation.id,
			},
			data: {
				balance: bankAccountInformation.balance.toNumber() - provision,
				provision: bankAccountInformation.provision.toNumber() + provision,
			},
		});
	}
}

export default BankService;
