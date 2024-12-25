import BankService from "src/service/BankService";
import BankValidation from "src/validation/bank/BankValidation";

class BankFacade {
  private bankValidation: BankValidation;
  private bankService: BankService;

  constructor() {
    this.bankValidation = new BankValidation();
    this.bankService = new BankService();
  }

  getAccountFromCard = async (req, res) => {
    let cardNumber: string, expirationDate: string, cvv: string;

    // get valid body from request
    try {
      ({ cardNumber, expirationDate, cvv } = await this.bankValidation.getAccountFromCardRequest(req));
    } catch (e: any) {
      return res.status(400).send({ error: e.message });
    }

    // get account information
    let bankAccountInformation;
    try {
      bankAccountInformation = await this.bankService.getAccountFromCard(cardNumber, expirationDate, cvv);
    } catch (error: any) {
      return res.status(500).send(error.message);
    }

    // keep auditlog
    try {
      bankAccountInformation = await this.bankService.writeAuditLog(`Bank account information for card number "${cardNumber}" is queried.`);
    } catch (error: any) {
      console.error(error.message);
    }

    // return response
    return res.status(200).send(bankAccountInformation);
  };
}

export default BankFacade;
