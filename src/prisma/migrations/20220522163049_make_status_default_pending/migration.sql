-- AlterTable
ALTER TABLE "courses_enrolled_in" ALTER COLUMN "status" SET DEFAULT E'PENDING';

-- AlterTable
ALTER TABLE "jobs_applied_for" ALTER COLUMN "status" SET DEFAULT E'PENDING';

-- AlterTable
ALTER TABLE "organization_requests" ALTER COLUMN "status" SET DEFAULT E'PENDING';
