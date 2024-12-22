-- CreateTable
CREATE TABLE "account" (
    "id" SERIAL NOT NULL,
    "balance" DECIMAL(15,2) NOT NULL,
    "provision" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auditlog" (
    "id" SERIAL NOT NULL,
    "action" VARCHAR(255) NOT NULL,
    "performed_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "auditlog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "card" (
    "id" SERIAL NOT NULL,
    "account_id" INTEGER NOT NULL,
    "number" VARCHAR(16) NOT NULL,
    "expiration_date" VARCHAR(5) NOT NULL,
    "cvv" CHAR(3) NOT NULL,

    CONSTRAINT "card_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transaction" (
    "id" SERIAL NOT NULL,
    "sender_account_id" INTEGER,
    "receiver_account_id" INTEGER,
    "sender_card_id" INTEGER,
    "amount" DECIMAL(15,2) NOT NULL,
    "transaction_date" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" VARCHAR(255),

    CONSTRAINT "transaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "unique_card_number" ON "card"("number");

-- AddForeignKey
ALTER TABLE "card" ADD CONSTRAINT "card_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_receiver_account_id_fkey" FOREIGN KEY ("receiver_account_id") REFERENCES "account"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_sender_account_id_fkey" FOREIGN KEY ("sender_account_id") REFERENCES "account"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_sender_card_id_fkey" FOREIGN KEY ("sender_card_id") REFERENCES "card"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

