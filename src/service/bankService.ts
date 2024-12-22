import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getBankAccountInformation = async (
  inputPath: string,
  opacity: number
): Promise<any[]> => {
  try {
    const result = await prisma.account.findMany();
    return result;
  } catch (e: any) {
    throw new Error(`Database Error: ${e.message}`);
  } finally {
    await prisma.$disconnect();
  }
};

export default {
  getBankAccountInformation,
};
