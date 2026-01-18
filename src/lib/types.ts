// Courses
export type Section = {
  crn: number,
  credits: number,
  time: string,
  days: DayCode[]
  instructor: string,
  location: string,
  prerequisites: string[],
  studentRequirements: string[],
  fulfilledRequirements: string[]
}

export type Course = {
  id: number,
  name: string,
  number: string,
  abbreviation: string,
  sections: Record<number, Section>,
}

export type CoursePlan = {
  id: string,
  name: string,
  courses: Course[]
}

export const DAY_CODES = [
  "M", "T", "W", "TH", "F",
  "MT", "MW", "MTH", "MF", "TW", "TTH", "TF", "WTH", "WF", "THF",
  "MTW", "MTTH", "MTF", "MWTH", "MWF", "MTHF", "TWTH", "TWF", "TTHF", "WThF",
  "MTWTh", "MTThF", "MWThF", "TWThF",
  "MTWThF"
] as const;

export type DayCode = "M" | "T" | "W" | "TH" | "F";

export const dayAliases: Record<string, DayCode> = {
  MON: "M",
  MONDAY: "M",

  TU: "T",
  TUE: "T",
  TUES: "T",
  TUESDAY: "T",

  WED: "W",
  WEDNESDAY: "W",

  TH: "TH",
  THU: "TH",
  THUR: "TH",
  THURS: "TH",
  THURSDAY: "TH",

  FRI: "F",
  FRIDAY: "F",
};

const dayAliasesOrdered = Object.entries(dayAliases)
  .sort((a, b) => b[0].length - a[0].length);

export const DAY_ALIAS_RE = new RegExp(
  `\\b(${dayAliasesOrdered.map(([k]) => k).join("|")})\\b`,
  "g"
);

export type TimeSlot = "8:20am-9:10am" | "9:25am-10:15am" | "10:30am-11:20am" | "11:30am-12:20pm" | "12:50pm-1:40pm" |
  "2pm-2:50pm" | "3:30pm-4:20pm" | "5:05pm-5:55pm" 
  | "9:30am-10:45am" | "11:00am-12:15pm" | "12:30pm-1:45pm" | "2pm-3:15pm" | "3:30pm-4:45pm" | "5:05pm-6:20pm"
;

export const timeAliases: Record<string, TimeSlot | TimeSlot[]> = {
  "2pm": ["2pm-2:50pm", "2pm-3:15pm"],
  "3:30pm": ["3:30pm-4:20pm", "3:30pm-4:45pm"],
  "5pm": ["5:05pm-5:55pm", "5:05pm-6:20pm"],
}

// Users
export type User = {
  userId: string,
  username: string,
  password: string,
  email?: string,
  classYear?: number,
  majors?: string[],        // array of major IDs
  minors?: string[],        // array of minor IDs
  coursesTaken?: string[]   // array of course IDs (CRNs)

}

// Errors
export class PlanNotFoundError extends Error {}
export class CourseNotFoundError extends Error {}
export class CourseAlreadyInPlanError extends Error {}