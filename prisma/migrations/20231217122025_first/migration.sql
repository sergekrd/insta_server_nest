-- CreateTable
CREATE TABLE "accounts" (
    "id" UUID NOT NULL,
    "username" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "proxy_string" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cookies" (
    "id" UUID NOT NULL,
    "account" UUID NOT NULL,
    "cookie" VARCHAR NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "cookies_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "accounts_username_key" ON "accounts"("username");

-- CreateIndex
CREATE UNIQUE INDEX "cookies_account_key" ON "cookies"("account");

-- AddForeignKey
ALTER TABLE "cookies" ADD CONSTRAINT "cookies_account_fkey" FOREIGN KEY ("account") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
