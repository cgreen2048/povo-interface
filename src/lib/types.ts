// Courses
export type Section = {
  crn: number,
  credits: number,
  time: string,
  days: DayCode[]
  instructor: string,
  location: string,
  requirements: string[]
}

export type Course = {
  id: number,
  name: string,
  number: string,
  abbreviation: string,
  sections: Record<number, Section>,
  prerequisites: string[],
  fulfilledRequirements: string[],
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

export type DayCode = "M" | "T" | "W" | "Th" | "F";

const dayAliases: Record<string, DayCode> = {
  MON: "M",
  MONDAY: "M",

  TU: "T",
  TUE: "T",
  TUES: "T",
  TUESDAY: "T",

  WED: "W",
  WEDNESDAY: "W",

  TH: "Th",
  THU: "Th",
  THUR: "Th",
  THURS: "Th",
  THURSDAY: "Th",

  FRI: "F",
  FRIDAY: "F",
};

export const dayAliasesOrdered = Object.entries(dayAliases)
  .sort((a, b) => b[0].length - a[0].length);

export const DAY_ALIAS_RE = new RegExp(
  `\\b(${dayAliasesOrdered.map(([k]) => k).join("|")})\\b`,
  "g"
);


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