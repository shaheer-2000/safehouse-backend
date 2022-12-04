/*
  Warnings:

  - A unique constraint covering the columns `[username]` on the table `organization_requests` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "organization_requests_username_key" ON "organization_requests"("username");
