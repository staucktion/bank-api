import { account, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getBankAccountInformation = async (
  inputPath: string,
  opacity: number
): Promise<any[]> => {
  try {
    const accounts: account[] = await prisma.account.findMany({
      include: {
        cards: true,
        receiver_transactions: true,
        sender_transactions: true,
      },
    });
    return accounts;
  } catch (e: any) {
    throw new Error(`Database Error: ${e.message}`);
  } finally {
    await prisma.$disconnect();
  }
};

export default {
  getBankAccountInformation,
};
