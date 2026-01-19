import { Course, Section, DayCode, dayAliases, DAY_ALIAS_RE } from './types';
import { courseAbbreviations } from './courseAbbreviations';
import { courseAttributes } from './courseAttributes';

export function searchAlgorithm(courses: Course[], query: string)  {
    let searchCourses = structuredClone(courses);
    let normalizedQuery = query.toUpperCase()
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
    
    const crnMatches = normalizedQuery.match(/\b\d{5}\b/g);
    if (crnMatches) {
        searchCourses = searchCourses.filter(course => 
            Object.values(course.sections)
            .some(section => crnMatches.includes(section.crn.toString())));
    }

    const courseAbbrevPlusNumberMatches = extractCourseAbbrevPlusNumbers(normalizedQuery);
    if (courseAbbrevPlusNumberMatches.length > 0) {
        const filteredMatchesByAbbrev = courseAbbrevPlusNumberMatches.filter(code => {
            const abbrev = code.split(" ")[0];
            return courseAbbreviations.has(abbrev);
        });

        searchCourses = searchCourses.filter(course => {
            const code = `${course.abbreviation.toUpperCase()} ${course.number}`; 
            return filteredMatchesByAbbrev.includes(code);
        });
    }


    // Require at least one day code in first group, then in additional groups, match subsequent days w/priority given to Th
    const dayMatches = normalizedQuery.match(/\b(?:TH|[MTWF])(?:\s*(?:TH|[MTWF]))*\b/g);
    const days = dayMatches ? findQueryDays(dayMatches) : [];

    const timeRangeMatches = normalizedQuery.match(TIME_RANGE_RE);

    // const timeStartMatches = normalizedQuery.match(TIME_START_RE);
    // if (timeStartMatches) {
    //     searchCourses = searchCourses.filter((course: Course) => {
    //         return Object.values(course.sections).some((section: Section) => {
    //             return timeStartMatches.includes(section.time);
    //         })
    //     })
    // }

    const credits = extractCreditsFromQuery(normalizedQuery);

    // Add full list of attributes to filter out matches that aren't in the attributes (ex. "THAT")
    const rawAttributeMatches = normalizedQuery.match(/\b[A-Z0-9]{2,4}\b/g);
    const filteredAttributeMatches = rawAttributeMatches ? rawAttributeMatches.filter(attr => courseAttributes.has(attr)) : [];

    const q = {
        days: days ?? [],
        timeRanges: timeRangeMatches ?? [],
        credits: credits ?? [],
        attributes: filteredAttributeMatches ?? []
    }
    searchCourses = searchCourses.filter((course: Course) =>
        Object.values(course.sections).some((section: Section) =>
            sectionSatisfiesAllMatches(section, q)
        )
    );


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
    const creditsRe = /\b(?:(?<a>[1-9]|1[0-9])\s*(?:OR|\/|-)\s*)?(?<b>[1-9]|1[0-9])\s*(?:CREDITS|CREDIT|CR|CRED)(?:[\.\?])?\b/gi;

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

const sectionSatisfiesAllMatches = (section: Section, q: {
    days: DayCode[],
    timeRanges: string[],
    credits: number[],
    attributes: string[]
}): boolean => {

    if (q.days.length > 0 && q.days.some(day => !section.days.includes(day))) {
        return false;
    }

    if (q.timeRanges.length > 0 && !q.timeRanges.includes(section.time.toUpperCase())) {
        return false;
    }

    if (q.credits.length > 0 && !q.credits.includes(section.credits)) {
        return false;
    }

    if (q.attributes.length > 0 && !section.fulfilledRequirements.some(attr => q.attributes.includes(attr))) {
        return false;
    }

    return true;
}

