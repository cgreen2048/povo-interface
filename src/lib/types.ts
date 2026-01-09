// Courses
export type Course = {
  id: number,
  name: string,
  number: string,
  abbreviation: string,
  credits: number,
  instructor: string,
  location: string,
  timesOffered: string[],
  prerequisites: string[],
  requirements: string[],
  fulfilledRequirements: string[],
}

export type CoursePlan = {
  id: string,
  name: string,
  courses: Course[]
}


// Errors
export class PlanNotFoundError extends Error {}
export class CourseNotFoundError extends Error {}
export class CourseAlreadyInPlanError extends Error {}