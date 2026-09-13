/*
  Warnings:

  - A unique constraint covering the columns `[courseOfferingId,day,startTime,endTime]` on the table `class_routines` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "class_routines_courseOfferingId_day_startTime_endTime_key" ON "class_routines"("courseOfferingId", "day", "startTime", "endTime");
