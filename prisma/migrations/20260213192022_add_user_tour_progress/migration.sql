-- CreateTable
CREATE TABLE "UserTourProgress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tourId" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "skipped" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserTourProgress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "UserTourProgress_userId_idx" ON "UserTourProgress"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserTourProgress_userId_tourId_key" ON "UserTourProgress"("userId", "tourId");

-- AddForeignKey
ALTER TABLE "UserTourProgress" ADD CONSTRAINT "UserTourProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
