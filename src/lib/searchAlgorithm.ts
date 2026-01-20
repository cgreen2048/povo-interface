import { Course, Section, DayCode, dayAliases, DAY_ALIAS_RE } from './types';
import { courseAbbreviations } from './courseAbbreviations';
import { courseAttributes } from './courseAttributes';

export function searchAlgorithm(courses: Course[], query: string): Course[] {
    if (!query || query.trim() === "") {
        return courses;
    }

    let searchCourses = structuredClone(courses);
    const normalizedQuery = query.toUpperCase()
        .replace(/\s*[-–—]\s*/g, '-')  // normalize dashes
        .replace(DAY_ALIAS_RE, match => dayAliases[match]) // replace day aliases
        .replace(/\s+/g, ' ')         // normalize spaces
        .trim();
    
    // This section handles HARD CONSTRAINTS EXTRACTED VIA REGEX

    // For the future, switch to matchALl to parse between CRNs and course numbers
    // const forbiddenPrefix = `(?:${abbrevsRe})[\\s:-]*`;         // ?: is non-capturing group to grab course abbrev but don't save for memory
    // const crnPattern = `(?<!${forbiddenPrefix})\\b\\d{5}`;      // neg lookbehind to ensure no abbrev before CRN (\b\d{5}) with ?<!pattern
    // const crnRegex = new RegExp(crnPattern, 'g');               // g for global
    // const crnMatches = normalizedQuery.match(crnPattern);     
    
    // const crnMatches = normalizedQuery.match(/\b\d{5}\b/g);
    // if (crnMatches) {
    //     searchCourses = searchCourses.filter(course => 
    //         Object.values(course.sections)
    //         .some(section => crnMatches.includes(section.crn.toString())));
    // }

    const courseAbbrevPlusNumberMatches = extractCourseAbbrevPlusNumbers(normalizedQuery);
    const filteredMatchesByAbbrev = courseAbbrevPlusNumberMatches.filter(code => {
            const abbrev = code.split(" ")[0];
            return courseAbbreviations.has(abbrev);
        });
    const courseNumbers = new Set(filteredMatchesByAbbrev.map(code => code.split(" ")[1]));

    const rawCrnMatches = normalizedQuery.match(/\b\d{5}\b/g) ?? [];
    const crnMatches = rawCrnMatches.filter(crn => !courseNumbers.has(crn));

    if (crnMatches.length > 0) {
        const crnSet = new Set(crnMatches);
        searchCourses = searchCourses.filter(course => 
            Object.values(course.sections)
            .some(section => crnSet.has(section.crn.toString())));
    }

    if (courseAbbrevPlusNumberMatches.length > 0) {
        searchCourses = searchCourses.filter(course => {
            const code = `${course.abbreviation.toUpperCase()} ${course.number}`; 
            return filteredMatchesByAbbrev.includes(code);
        });
    }



    const abbrevTokens = normalizedQuery.match(/\b[A-Z0-9]{2,4}\b/g) ?? [];
    const deptOnlyTokens: string[] = [];
    const attributeOnlyTokens: string[] = [];
    const bothTokens: string[] = [];
    for (const token of abbrevTokens) {
        const isDept = courseAbbreviations.has(token);
        const isAttr = courseAttributes.has(token);

        if (isDept && isAttr) bothTokens.push(token);
        else if (isDept) deptOnlyTokens.push(token);
        else if (isAttr) attributeOnlyTokens.push(token);
    }
    console.log(deptOnlyTokens, attributeOnlyTokens, bothTokens);

    // Require at least one day code in first group, then in additional groups, match subsequent days w/priority given to Th
    const dayMatches = normalizedQuery.match(/\b(?:TH|[MTWF])(?:\s*(?:TH|[MTWF]))*\b/g);
    const days = dayMatches ? findQueryDays(dayMatches) : [];

    const timeRangeMatches = normalizedQuery.match(TIME_RANGE_RE) ?? [];

    // const timeStartMatches = normalizedQuery.match(TIME_START_RE);
    // if (timeStartMatches) {
    //     searchCourses = searchCourses.filter((course: Course) => {
    //         return Object.values(course.sections).some((section: Section) => {
    //             return timeStartMatches.includes(section.time);
    //         })
    //     })
    // }

    const credits = extractCreditsFromQuery(normalizedQuery);
    searchCourses = searchCourses.filter((course: Course) =>
        Object.values(course.sections).some((section: Section) =>
            sectionSatisfiesAllMatches(
                course.abbreviation.toUpperCase().trim(),
                section,
                days,
                timeRangeMatches,
                credits,
                deptOnlyTokens,
                attributeOnlyTokens,
                bothTokens
            )
        )
    );

    const hasAnyMatches =
        crnMatches.length > 0 ||
        courseAbbrevPlusNumberMatches.length > 0 ||
        deptOnlyTokens.length > 0 ||
        attributeOnlyTokens.length > 0 ||
        bothTokens.length > 0 ||
        days.length > 0 ||
        timeRangeMatches.length > 0 ||
        credits.length > 0;

    if (!hasAnyMatches) return [];


    // This section handles similarity search that represents SOFT CONSTRAINTS/KEYWORDS

    return searchCourses;
}

const extractCourseAbbrevPlusNumbers = (query: string): string[] => {
    const courseAbbrevPlusNumberPattern = /\b([A-Z]{2,4})[\s:-]*(\d{5})\b/gi;
    const matches = [...query.matchAll(courseAbbrevPlusNumberPattern)];
    return matches.map(match => `${match[1]} ${match[2]}`);
}

const findQueryDays = (daysStrings: string[]): DayCode[] => {
    const days: Set<DayCode> = new Set();
    daysStrings.forEach((daysString: string) => {
        daysString = daysString.replace(/\s+/g, "");
        for (let i = 0; i < daysString.length; i++) {
            if (daysString.startsWith("TH", i)) {
                days.add("TH");
                i++;
            }
            else {
                const ch = daysString[i] as DayCode;
                if (["M", "T", "W", "F"].includes(ch)) {
                    days.add(ch);
                }
            }
        } 
    })
    return [...days];
}

const extractCreditsFromQuery = (query: string): number[] => {
    const credits = new Set<number>();

    // Handles "3 credits", "3 or 4 credits", "3/4 credits", "3-4 credits", etc.
    const creditsRe = /\b(?:(?<a>[1-9]|1[0-9])\s*(?:OR|\/|-)\s*)?(?<b>[1-9]|1[0-9])\s*(?:CREDITS|CREDIT|CR|CRED)(?:[.?])?\b/gi;

    for (const match of query.matchAll(creditsRe)) {
        const a = match.groups?.a ? Number(match.groups.a) : null;
        const b = Number(match.groups?.b ?? match[3]);

        if (a !== null) {
            credits.add(a);
        }
        credits.add(b);
    }

    return [...credits];
}

const TIME_TOKEN = /\d{1,2}(?::\d{2})?(?:AM|PM)?/;

const TIME_RANGE_RE = new RegExp(
    `\\b(${TIME_TOKEN.source})-(${TIME_TOKEN.source})\\b`,
    "gi"
);

// const TIME_START_RE = new RegExp(
//     `\\b(${TIME_TOKEN.source})\\b`,
//     "gi"
// );

const sectionSatisfiesAllMatches = (
    courseAbbrev: string,
    // maybe add name later
    section: Section,
    days: DayCode[],
    timeRanges: string[],
    credits: number[],
    depts: string[],
    attributes: string[],
    both: string[]
): boolean => {
    if (days.length > 0 && days.some(day => !section.days.includes(day))) return false;
    if (timeRanges.length > 0 && !timeRanges.includes(section.time.toUpperCase())) return false;
    if (credits.length > 0 && !credits.includes(section.credits)) return false;

    // Filter out courses that aren't in any (OR) of the depts in the list
    if (depts.length > 0 && !depts.includes(courseAbbrev) && !both.includes(courseAbbrev)) return false;

    // Filter out courses that don't fulfill all (AND) of the attributes in the list
    if (attributes.length > 0 && !attributes.every(attr => section.fulfilledRequirements.includes(attr))) return false;

    // Some tokens could be either dept or attribute, so we check if at least one matches
    const inDept = depts.includes(courseAbbrev);
    if (both.length > 0) {
        for (const token of both) {
            // for every token in both, check if it matches the course abbrev or any fulfilled requirements
            if (!inDept && courseAbbrev !== token && !section.fulfilledRequirements.includes(token)) return false;
        }
    }

    return true;
}

