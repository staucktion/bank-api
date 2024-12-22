import express from "express";
import bankFacade from "src/facade/bank/bankFacade";

const router = express.Router();

// todo delete that dummy endpoint to get account without validation
router.get("/bank/account/:id", async (req, res) => {
  return await bankFacade.getDummyBankAccountInformation(req, res);
});

router.post("/bank/account", async (req, res) => {
  return await bankFacade.getAccountFromCard(req, res);
});

export default router;
