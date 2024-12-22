import bankService from "src/service/bankService";

const getBankAccountInformation = async (req, res) => {
  // get parameter
  const accountId: number = +req.params.id;

  // check if parameter is number
  if (isNaN(accountId)) {
    return res.status(400).json({ message: "Invalid account ID" });
  }

  // perform operations
  try {
    const bankAccountInformation = await bankService.getBankAccountInformation(
      accountId
    );

    return res.status(200).send(bankAccountInformation);
  } catch (e: any) {
    return res.status(500).send(e.message);
  }
};

export default {
  getBankAccountInformation,
};
