const getBankAccountInformationValidation = async (req) => {
  const { cardNumber, expirationDate, cvv } = req.body;

  if (!cardNumber || !expirationDate || !cvv) {
    throw new Error(
      `Input Error: accountNumber, expirationDate, cvv is required`
    );
  }

  return { cardNumber, expirationDate, cvv };
};

export default {
  getBankAccountInformationValidation,
};
