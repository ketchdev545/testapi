-- CreateTable
CREATE TABLE "employes" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "position" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "employes_email_key" ON "employes"("email");
