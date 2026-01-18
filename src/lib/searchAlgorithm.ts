import { Course, Section, DayCode, dayAliases, DAY_ALIAS_RE } from './types';

const courseAbbrevs = [
    "ACCT", "ACMS", "ACTG", "AFST", "AL", "ALHN", "ALSF", "AME", "AMST", "ANTH",
    "ARCH", "ARHI", "ARST", "AS", "ASIA", "BAAL", "BAEG", "BASC", "BAUG", "BES",
    "BIOS", "BPHY", "CBE", "CDT", "CE", "CHEM", "CHR", "CLAS", "CLGR", "CLLA",
    "CNST", "CSAL", "CSE", "CSEM", "CSLC", "CST", "DESN", "DMA", "DS", "EALC",
    "EALJ", "EALK", "ECON", "EDU", "EE", "EG", "ENER", "ENGL", "ESS", "ESTM",
    "EURO", "FIN", "FTT", "FYS", "GE", "GEST", "GH", "GLAF", "GRED", "GSC",
    "HESB", "HHS", "HIST", "HPS", "IBMS", "IIPS", "ILS", "IRLL", "IRST", "ISS",
    "ITAO", "JED", "KSGA", "LAW", "LLEA", "LLRO", "MARK", "MATH", "MBA", "MBAE",
    "MDMK", "MDSC", "MEAR", "MELC", "MGA", "MGTO", "MI", "MNAE", "MNAR", "MSA", // masters
    "MSBR", "MSDM", "MSFR", "MSL", "MSM", "MSMG", "MUS", "NSBH", "NSCI", "PCAY",
    "PHIL", "PHYS", "PLS", "POLS", "PPE", "PRL", "PS", "PSY", "RE", "REG", "ROFR",
    "ROIT", "ROPO", "ROSP", "RU", "SACM", "SC", "SCGE", "SCPP", "SEI", "SLAV",
    "SMAC", "SOC", "SOCO", "STV", "SUS", "SUSD", "THEO", "WR",
];

export function searchAlgorithm(courses: Course[], query: string)  {
    let searchCourses = structuredClone(courses);
    let normalizedQuery = query.toUpperCase()
        .replace(/\s*[-–—]\s*/g, '-')  // normalize dashes
        .replace(DAY_ALIAS_RE, match => dayAliases[match]) // replace day aliases
        .replace(/\s+/g, ' ')         // normalize spaces
        .trim();
    normalizedQuery = normalizeTimeDashes(normalizedQuery);
    
    // This section handles HARD CONSTRAINTS EXTRACTED VIA REGEX

    // For the future, switch to matchALl to parse between CRNs and course numbers
    const abbrevsRe = courseAbbrevs.join('|');
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

    const courseAbbrevPlusNumberPattern = `\\b(?:${abbrevsRe})[\\s:-]*\\d{5}\\b`;
    const courseAbbrevPlusNumberRegex = new RegExp(courseAbbrevPlusNumberPattern, 'g');
    const courseAbbrevPlusNumberMatches = normalizedQuery.match(courseAbbrevPlusNumberRegex);

    if (courseAbbrevPlusNumberMatches) {
        const normalizedCourseCodes = courseAbbrevPlusNumberMatches.map(match =>
            match.replace(/[\s:-]+/g, " ").trim()
        );

        searchCourses = searchCourses.filter(course => {
            const code = `${course.abbreviation.toUpperCase()} ${course.number}`; 
            return normalizedCourseCodes.includes(code);
        });
    }


    // Require at least one day code in first group, then in additional groups, match subsequent days w/priority given to Th
    const dayMatches = normalizedQuery.match(/\b(?:TH|[MTWF])(?:\s*(?:TH|[MTWF]))*\b/g);
    if (dayMatches) {
        const days = findQueryDays(dayMatches);

        // Find all courses that contains at least one section that has all days in the query
        searchCourses = searchCourses.filter((course: Course) =>
            Object.values(course.sections).some((section: Section) =>
            days.every(d => section.days.includes(d))
            )
        );
    }

    const timeRangeMatches = normalizedQuery.match(TIME_RANGE_RE);
    if (timeRangeMatches) {
        searchCourses = searchCourses.filter(course =>
            Object.values(course.sections).some(section =>
            timeRangeMatches.includes(section.time)
            )
        );
    }

    const timeStartMatches = normalizedQuery.match(TIME_START_RE);
    if (timeStartMatches) {
        searchCourses = searchCourses.filter((course: Course) => {
            return Object.values(course.sections).some((section: Section) => {
                return timeStartMatches.includes(section.time);
            })
        })
    }

    const credits = extractCreditsFromQuery(normalizedQuery);
    if (credits.length > 0) {
        searchCourses = searchCourses.filter(course =>
            Object.values(course.sections).some(section =>
            credits.includes(section.credits)
            )
        );
    }

    // Add full list of attributes to filter out matches that aren't in the attributes (ex. "THAT")
    const fulfilledRequirementsMatches = normalizedQuery.match(/\b[A-Z]{4}\b/g);
    if (fulfilledRequirementsMatches) {
        searchCourses = searchCourses.filter((course: Course) => 
            Object.values(course.sections).some((section: Section) => 
            section.fulfilledRequirements.some(req => fulfilledRequirementsMatches.includes(req)))
        );
    }


    // This section handles similarity search that represents SOFT CONSTRAINTS/KEYWORDS

    return searchCourses;
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
    const creditsRe = /\b(?:(?<a>[1-9]|1[0-9])\s*(?:OR|\/|-)\s*)?(?<b>[1-9]|1[0-9])\s*(?:CREDITS|CREDIT|CR|CRED)[\.\?]\b/gi;

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

const TIME_TOKEN = /\d{1,2}(?::\d{2})?(?:am|pm)?/;

const TIME_RANGE_RE = new RegExp(
    `\\b(${TIME_TOKEN.source})-(${TIME_TOKEN.source})\\b`,
    "gi"
);

const TIME_START_RE = new RegExp(
    `\\b(${TIME_TOKEN.source})\\b`,
    "gi"
);

function normalizeTimeDashes(query: string) {
    return query.replace(TIME_RANGE_RE, "$1-$2");
}


