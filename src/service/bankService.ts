import { account, card, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getDummyBankAccountInformation = async (
  bankAccountId: number
): Promise<account | null> => {
  try {
    const accountDetails: account | null = await prisma.account.findUnique({
      where: {
        id: bankAccountId,
      },
      include: {
        cards: true,
        receiver_transactions: true,
        sender_transactions: true,
      },
    });
    return accountDetails;
  } catch (e: any) {
    throw new Error(`Database Error: ${e.message}`);
  } finally {
    await prisma.$disconnect();
  }
};

const getAccountFromCard = async (
  cardNumber: string,
  expirationDate: string,
  cvv: string
): Promise<account | null> => {
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
        cards: true
      },
    });

    return account;
  } catch (e: any) {
    throw new Error(`Database Error: ${e.message}`);
  } finally {
    await prisma.$disconnect();
  }
};

export default {
  getDummyBankAccountInformation,
  getAccountFromCard,
};
