import { account, PrismaClient } from "@prisma/client";
import CustomError from "src/error/CustomError";

const prisma = new PrismaClient();

class BankService {
  public async getAccountFromCard(
    cardNumber: string,
    expirationDate: string,
    cvv: string
  ): Promise<account | null> {
    try {
      const account = await prisma.account.findFirst({
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
      await prisma.$disconnect();
      CustomError.builder()
        .setErrorType("Prisma Error")
        .setClassName(this.constructor.name)
        .setMethodName("getAccountFromCard")
        .setError(error)
        .build()
        .throwError();
    }
  }
}

export default BankService;
