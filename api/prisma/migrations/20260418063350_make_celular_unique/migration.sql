/*
  Warnings:

  - A unique constraint covering the columns `[celular]` on the table `FUNCIONARIOS` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[celular]` on the table `MORADORES` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "FUNCIONARIOS_celular_key" ON "FUNCIONARIOS"("celular");

-- CreateIndex
CREATE UNIQUE INDEX "MORADORES_celular_key" ON "MORADORES"("celular");
