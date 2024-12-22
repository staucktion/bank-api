import bankService from "src/service/bankService";
import bankValidation from "src/validation/bank/bankValidation";

const getDummyBankAccountInformation = async (req, res) => {
  // get parameter
  const accountId: number = +req.params.id;

  // check if parameter is number
  if (isNaN(accountId)) {
    return res.status(400).json({ message: "Invalid account ID" });
  }

  // perform operations
  try {
    const bankAccountInformation =
      await bankService.getDummyBankAccountInformation(accountId);

    return res.status(200).send(bankAccountInformation);
  } catch (e: any) {
    return res.status(500).send(e.message);
  }
};

const getAccountFromCard = async (req, res) => {
  let cardNumber: string, expirationDate: string, cvv: string;

  // get valid body from request
  try {
    ({ cardNumber, expirationDate, cvv } =
      await bankValidation.getBankAccountInformationValidation(req));
  } catch (e: any) {
    return res.status(400).send({ error: e.message });
  }

  // perform operations
  try {
    const bankAccountInformation = await bankService.getAccountFromCard(
      cardNumber,
      expirationDate,
      cvv
    );
    return res.status(200).send(bankAccountInformation);
  } catch (e: any) {
    return res.status(500).send(e.message);
  }
};

export default {
  getDummyBankAccountInformation,
  getAccountFromCard,
};
