 type DayOfWeek =
  | "SATURDAY"
  | "SUNDAY"
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY";

export interface IClassRoutine {
  courseOfferingId: string;
  day: DayOfWeek;
  startTime: string;
  endTime: string;
  room:string
}


export interface IClassRoutineUpdate {
  day?: DayOfWeek;
  startTime?: string;
  endTime?: string;
  room?: string;
}