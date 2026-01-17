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
    const normalizedQuery = query.toUpperCase()
        .replace(/\s+/g, ' ')
        .replace(DAY_ALIAS_RE, match => dayAliases[match])
        .trim();
    
    const abbrevsRe = courseAbbrevs.join('|');
    // const forbiddenPrefix = `(?:${abbrevsRe})[\\s:-]*`;         // ?: is non-capturing group to grab course abbrev but don't save for memory
    // const crnPattern = `(?<!${forbiddenPrefix})\\b\\d{5}`;      // neg lookbehind to ensure no abbrev before CRN (\b\d{5}) with ?<!pattern
    // const crnRegex = new RegExp(crnPattern, 'g');               // g for global
    // const crnMatches = normalizedQuery.match(crnPattern);     
    
    const crnMatches = normalizedQuery.match(/\b\d{5}\b/g);
    if (crnMatches) {
        searchCourses = searchCourses.filter(course => crnMatches.includes(course.id.toString()));
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
}

const findQueryDays = (daysStrings: string[]) => {
    const days: DayCode[] = [];
    daysStrings.forEach((daysString: string) => {
        daysString = daysString.replace(/\s+/g, "");
        for (let i = 0; i < daysString.length; i++) {
            if (daysString.startsWith("Th", i)) {
                if (!days.includes("Th")) {
                    days.push("Th");
                }
                i++;
            }
            else {
                const ch = daysString[i] as DayCode;
                if (["M", "T", "W", "Th"].includes(ch) && !days.includes(ch)) {
                    days.push(ch);
                }
            }
        } 
    })
    return days;
}


