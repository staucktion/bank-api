import bankService from "src/service/bankService";

const getBankAccountInformation = async (req, res) => {
  // get parameter
  const accountId: number = req.params.id;

  // check if parameter is number
  if (isNaN(accountId)) {
    return res.status(400).json({ errorId: 1, message: "Invalid account ID" });
  }

  try {
    return res
      .status(200)
      .send(await bankService.getBankAccountInformation("asd", 1));
  } catch (e: any) {
    return res.status(500).send(e.message);
  }
};

export default {
  getBankAccountInformation,
};
