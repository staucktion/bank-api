import { account, PrismaClient } from "@prisma/client";
import CustomError from "src/error/CustomError";
import PrismaUtil from "src/util/PrismaUtil";

class BankService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = PrismaUtil.getPrismaClient();
  }

  public async getAccountFromCard(
    cardNumber: string,
    expirationDate: string,
    cvv: string
  ): Promise<account | null> {
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
      await this.prisma.$disconnect();
    }
  }
}

export default BankService;
