import pool from "src/database/db";

const getBankAccountInformation = async (
  inputPath: string,
  opacity: number
): Promise<String> => {
  try {
    const result = await pool.query("SELECT * FROM account");
    return result.rows;
  } catch (e: any) {
    throw new Error(`Database Error: ${e.message}`);
  }
};

export default {
  getBankAccountInformation,
};
