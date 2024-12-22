import { account, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getBankAccountInformation = async (
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

export default {
  getBankAccountInformation,
};
