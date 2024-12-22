import express from "express";
import bankFacade from "src/facade/bank/bankFacade";

const router = express.Router();

router.get("/bank/account/:id", async (req, res) => {
  return await bankFacade.getBankAccountInformation(req, res);
});

export default router;
