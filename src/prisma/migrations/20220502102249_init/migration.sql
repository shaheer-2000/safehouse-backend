-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('PENDING', 'CURRENTLY_WORKING', 'FIRED', 'QUITTED', 'REJECTED');

-- CreateEnum
CREATE TYPE "CourseStatus" AS ENUM ('PENDING', 'ENROLLED', 'FINISHED', 'DROPPED_OUT', 'CERTIFIED');

-- CreateEnum
CREATE TYPE "OrgRequestStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- CreateTable
CREATE TABLE "login" (
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "login_pkey" PRIMARY KEY ("username")
);

-- CreateTable
CREATE TABLE "organizations" (
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "website" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phone_num" TEXT NOT NULL,
    "logo" TEXT NOT NULL,
    "username" TEXT NOT NULL,

    CONSTRAINT "organizations_pkey" PRIMARY KEY ("username")
);

-- CreateTable
CREATE TABLE "users" (
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "gender" "Gender" NOT NULL,
    "profile_image" TEXT NOT NULL,
    "date_of_birth" TIMESTAMP(3) NOT NULL,
    "phone_num" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "affiliated_org" TEXT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("username")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "authority_level" INTEGER NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_roles" (
    "username" TEXT NOT NULL,
    "roleId" INTEGER NOT NULL,

    CONSTRAINT "user_roles_pkey" PRIMARY KEY ("username")
);

-- CreateTable
CREATE TABLE "courses" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "instructor" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "lister" TEXT NOT NULL,

    CONSTRAINT "courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jobs" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "employer" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "lister" TEXT NOT NULL,

    CONSTRAINT "jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jobs_applied_for" (
    "status" "JobStatus" NOT NULL,
    "username" TEXT NOT NULL,
    "job_id" INTEGER NOT NULL,

    CONSTRAINT "jobs_applied_for_pkey" PRIMARY KEY ("username","job_id")
);

-- CreateTable
CREATE TABLE "courses_enrolled_in" (
    "status" "CourseStatus" NOT NULL,
    "username" TEXT NOT NULL,
    "course_id" INTEGER NOT NULL,

    CONSTRAINT "courses_enrolled_in_pkey" PRIMARY KEY ("username","course_id")
);

-- CreateTable
CREATE TABLE "organization_requests" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "website" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phone_num" TEXT NOT NULL,
    "logo" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "status" "OrgRequestStatus" NOT NULL,

    CONSTRAINT "organization_requests_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_affiliated_org_key" ON "users"("affiliated_org");

-- AddForeignKey
ALTER TABLE "organizations" ADD CONSTRAINT "organizations_username_fkey" FOREIGN KEY ("username") REFERENCES "login"("username") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_username_fkey" FOREIGN KEY ("username") REFERENCES "login"("username") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_affiliated_org_fkey" FOREIGN KEY ("affiliated_org") REFERENCES "login"("username") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_username_fkey" FOREIGN KEY ("username") REFERENCES "login"("username") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "courses" ADD CONSTRAINT "courses_lister_fkey" FOREIGN KEY ("lister") REFERENCES "login"("username") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_lister_fkey" FOREIGN KEY ("lister") REFERENCES "login"("username") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jobs_applied_for" ADD CONSTRAINT "jobs_applied_for_username_fkey" FOREIGN KEY ("username") REFERENCES "login"("username") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jobs_applied_for" ADD CONSTRAINT "jobs_applied_for_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "jobs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "courses_enrolled_in" ADD CONSTRAINT "courses_enrolled_in_username_fkey" FOREIGN KEY ("username") REFERENCES "login"("username") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "courses_enrolled_in" ADD CONSTRAINT "courses_enrolled_in_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
