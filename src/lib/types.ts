// Courses
export type Section = {
  crn: number,
  credits: number,
  time: string,
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