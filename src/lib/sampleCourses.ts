// sampleCourses.ts
import type { Course } from "./types";

export const sampleCourses: Course[] = [
  {
    id: 10001,
    name: "Data Structures",
    number: "20312",
    abbreviation: "CSE",
    sections: {
      1: {
        crn: 12345,
        credits: 3,
        time: "9:30am-10:45am",
        days: ["T", "TH"],
        instructor: "Prof. Nguyen",
        location: "Debartolo 101",
        prerequisites: ["CSE 20311"],
        studentRequirements: [],
        fulfilledRequirements: ["WRIT", "WKIN"],
      },
      2: {
        crn: 12346,
        credits: 3,
        time: "3:30pm-4:45pm",
        days: ["M", "W", "F"],
        instructor: "Prof. Nguyen",
        location: "Debartolo 105",
        prerequisites: ["CSE 20311"],
        studentRequirements: [],
        fulfilledRequirements: ["WRIT"],
      },
    },
  },

  {
    id: 10002,
    name: "Computer Architecture",
    number: "30321",
    abbreviation: "CSE",
    sections: {
      1: {
        crn: 22345,
        credits: 3,
        time: "10:30am-11:20am",
        days: ["M", "W", "F"],
        instructor: "Prof. Patel",
        location: "Fitzpatrick 356",
        prerequisites: ["CSE 20312"],
        studentRequirements: [],
        fulfilledRequirements: ["ALLN"],
      },
      2: {
        crn: 22346,
        credits: 4,
        time: "2pm-3:15pm",
        days: ["T", "TH"],
        instructor: "Prof. Patel",
        location: "Fitzpatrick 356",
        prerequisites: ["CSE 20312"],
        studentRequirements: [],
        fulfilledRequirements: ["ALLN", "WKIN"],
      },
    },
  },

  {
    id: 10003,
    name: "Linear Algebra",
    number: "20550",
    abbreviation: "MATH",
    sections: {
      1: {
        crn: 32345,
        credits: 3,
        time: "8:20am-9:10am",
        days: ["M", "W", "F"],
        instructor: "Prof. Garcia",
        location: "Hayes-Healy 125",
        prerequisites: [],
        studentRequirements: [],
        fulfilledRequirements: ["ACMS"], // pretend code exists in your set
      },
      2: {
        crn: 32346,
        credits: 4,
        time: "11:00am-12:15pm",
        days: ["T", "TH"],
        instructor: "Prof. Garcia",
        location: "Hayes-Healy 125",
        prerequisites: [],
        studentRequirements: [],
        fulfilledRequirements: ["ACMS", "WKIN"],
      },
    },
  },

  {
    id: 10004,
    name: "Foundations of Theology",
    number: "10001",
    abbreviation: "THEO",
    sections: {
      1: {
        crn: 42345,
        credits: 3,
        time: "11:30am-12:20pm",
        days: ["M", "W", "F"],
        instructor: "Prof. O'Connor",
        location: "Malloy 200",
        prerequisites: [],
        studentRequirements: [],
        fulfilledRequirements: ["MATH"], // pretend attribute code exists
      },
      2: {
        crn: 42346,
        credits: 3,
        time: "12:30pm-1:45pm",
        days: ["T", "TH"],
        instructor: "Prof. O'Connor",
        location: "Malloy 200",
        prerequisites: [],
        studentRequirements: [],
        fulfilledRequirements: ["THEO", "WRIT"],
      },
    },
  },

  {
    id: 10005,
    name: "Intro to Psychology",
    number: "10100",
    abbreviation: "PSY",
    sections: {
      1: {
        crn: 52345,
        credits: 3,
        time: "12:50pm-1:40pm",
        days: ["M", "W", "F"],
        instructor: "Prof. Kim",
        location: "Jordan 110",
        prerequisites: [],
        studentRequirements: [],
        fulfilledRequirements: ["SOSC"], // pretend attribute code exists
      },
      2: {
        crn: 52346,
        credits: 3,
        time: "2pm-2:50pm",
        days: ["M", "W", "F"],
        instructor: "Prof. Kim",
        location: "Jordan 110",
        prerequisites: [],
        studentRequirements: [],
        fulfilledRequirements: ["SOSC", "WKIN"],
      },
    },
  },
];
