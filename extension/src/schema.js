/*
 * RecruitFill — field schema
 *
 * This is the brain of the autofiller. Every college recruiting questionnaire
 * uses different field `name`/`id` attributes, but the *visible* labels are
 * fairly standardized ("First Name", "Graduation Year", "Club Coach Email",
 * etc.). The matcher builds a normalized text signature for each form field and
 * scores it against the `synonyms` below. `anti` keywords disqualify a match so
 * that, e.g., the athlete's "Email" field does not capture "Parent Email".
 *
 * Field types: text | email | tel | date | number | textarea | enum
 *   - enum fields carry `options` used both for the options-page dropdown and to
 *     match <select>/<radio> choices on the page.
 *   - `editable: false` fields are *derived* (computed from other fields) and are
 *     not shown on the options page; they only participate in matching.
 *
 * Attached to `window` so the content scripts (which share an isolated world)
 * can all see it without a module bundler.
 */
(function () {
  const US_STATES = [
    ["AL", "Alabama"], ["AK", "Alaska"], ["AZ", "Arizona"], ["AR", "Arkansas"],
    ["CA", "California"], ["CO", "Colorado"], ["CT", "Connecticut"], ["DE", "Delaware"],
    ["FL", "Florida"], ["GA", "Georgia"], ["HI", "Hawaii"], ["ID", "Idaho"],
    ["IL", "Illinois"], ["IN", "Indiana"], ["IA", "Iowa"], ["KS", "Kansas"],
    ["KY", "Kentucky"], ["LA", "Louisiana"], ["ME", "Maine"], ["MD", "Maryland"],
    ["MA", "Massachusetts"], ["MI", "Michigan"], ["MN", "Minnesota"], ["MS", "Mississippi"],
    ["MO", "Missouri"], ["MT", "Montana"], ["NE", "Nebraska"], ["NV", "Nevada"],
    ["NH", "New Hampshire"], ["NJ", "New Jersey"], ["NM", "New Mexico"], ["NY", "New York"],
    ["NC", "North Carolina"], ["ND", "North Dakota"], ["OH", "Ohio"], ["OK", "Oklahoma"],
    ["OR", "Oregon"], ["PA", "Pennsylvania"], ["RI", "Rhode Island"], ["SC", "South Carolina"],
    ["SD", "South Dakota"], ["TN", "Tennessee"], ["TX", "Texas"], ["UT", "Utah"],
    ["VT", "Vermont"], ["VA", "Virginia"], ["WA", "Washington"], ["WV", "West Virginia"],
    ["WI", "Wisconsin"], ["WY", "Wyoming"], ["DC", "District of Columbia"]
  ];

  const PARENT_ANTI = ["parent", "guardian", "mother", "father", "mom", "dad", "emergency", "reference", "counselor", "coach"];

  // Field definitions, in display order, grouped for the options page.
  const FIELDS = [
    // ---- Athlete ----
    { key: "firstName", label: "First name", group: "Athlete", type: "text",
      synonyms: ["first name", "fname", "given name", "first", "legal first", "student first", "athlete first", "player first"],
      anti: PARENT_ANTI.concat(["last", "middle", "coach", "school", "club", "company"]) },
    { key: "middleName", label: "Middle name / initial", group: "Athlete", type: "text",
      synonyms: ["middle name", "middle initial", "mname", "middle"], anti: PARENT_ANTI },
    { key: "lastName", label: "Last name", group: "Athlete", type: "text",
      synonyms: ["last name", "lname", "surname", "family name", "last", "legal last", "student last", "athlete last", "player last"],
      anti: PARENT_ANTI.concat(["first", "middle", "coach", "school", "club"]) },
    { key: "preferredName", label: "Preferred name / nickname", group: "Athlete", type: "text",
      synonyms: ["preferred name", "nickname", "goes by", "preferred first"], anti: PARENT_ANTI },
    { key: "dateOfBirth", label: "Date of birth", group: "Athlete", type: "date",
      synonyms: ["date of birth", "dob", "birth date", "birthdate", "birthday", "born"], anti: PARENT_ANTI },
    { key: "gender", label: "Gender", group: "Athlete", type: "enum",
      options: ["Male", "Female"],
      synonyms: ["gender", "sex"], anti: PARENT_ANTI },
    { key: "gradYear", label: "Graduation year (Class of)", group: "Athlete", type: "text",
      synonyms: ["graduation year", "grad year", "class of", "year of graduation", "expected graduation",
        "anticipated graduation", "hs graduation", "high school graduation", "class year", "graduating class", "grad"],
      anti: ["gpa"] },
    { key: "citizenship", label: "Citizenship", group: "Athlete", type: "text",
      synonyms: ["citizenship", "citizen", "nationality"] },

    // ---- Contact ----
    { key: "email", label: "Email", group: "Contact", type: "email",
      synonyms: ["email", "e mail", "email address", "personal email", "student email", "athlete email"],
      anti: PARENT_ANTI.concat(["coach", "school", "confirm", "re enter", "re type"]) },
    { key: "phone", label: "Cell phone", group: "Contact", type: "tel",
      synonyms: ["cell phone", "mobile phone", "cell", "mobile", "phone number", "phone", "telephone", "contact number", "cell number"],
      anti: PARENT_ANTI.concat(["coach", "home", "work", "fax", "school"]) },
    { key: "homePhone", label: "Home phone", group: "Contact", type: "tel",
      synonyms: ["home phone", "house phone", "landline", "home number"], anti: PARENT_ANTI },

    // ---- Address ----
    { key: "address1", label: "Street address", group: "Address", type: "text",
      synonyms: ["street address", "address line 1", "address 1", "mailing address", "home address", "street", "address"],
      anti: ["email", "ip", "line 2", "school", "club", "website"] },
    { key: "address2", label: "Address line 2 (apt/unit)", group: "Address", type: "text",
      synonyms: ["address line 2", "address 2", "apartment", "apt", "suite", "unit"], anti: ["school", "club"] },
    { key: "city", label: "City", group: "Address", type: "text",
      synonyms: ["city", "town", "city town"], anti: ["high school", "school", "club", "team", "coach", "college", "university"] },
    { key: "state", label: "State", group: "Address", type: "text",
      synonyms: ["state", "province", "state province", "region"],
      anti: ["high school", "school", "club", "team", "coach", "college", "university", "united states", "statement"] },
    { key: "zip", label: "ZIP / postal code", group: "Address", type: "text",
      synonyms: ["zip code", "zip", "postal code", "postcode", "zip postal"], anti: ["school", "club"] },
    { key: "country", label: "Country", group: "Address", type: "text",
      synonyms: ["country", "nation"], anti: ["school", "club"] },

    // ---- Academics ----
    { key: "highSchool", label: "High school name", group: "Academics", type: "text",
      synonyms: ["high school name", "high school", "current school", "school name", "hs name", "name of school", "current high school"],
      anti: ["coach", "college", "university", "city", "state", "club", "address", "previous", "middle school"] },
    { key: "highSchoolCity", label: "High school city", group: "Academics", type: "text",
      synonyms: ["high school city", "school city", "hs city"], anti: ["club"] },
    { key: "highSchoolState", label: "High school state", group: "Academics", type: "text",
      synonyms: ["high school state", "school state", "hs state"], anti: ["club"] },
    { key: "gpa", label: "GPA", group: "Academics", type: "text",
      synonyms: ["gpa", "grade point average", "cumulative gpa", "unweighted gpa", "weighted gpa", "core gpa"],
      anti: ["scale", "rank"] },
    { key: "gpaScale", label: "GPA scale (e.g. 4.0)", group: "Academics", type: "text",
      synonyms: ["gpa scale", "scale"] },
    { key: "classRank", label: "Class rank", group: "Academics", type: "text",
      synonyms: ["class rank", "rank in class", "class ranking"] },
    { key: "satTotal", label: "SAT total", group: "Academics", type: "text",
      synonyms: ["sat total", "sat score", "sat composite", "combined sat", "total sat", "sat"],
      anti: ["math", "reading", "verbal", "ebrw", "act", "subject"] },
    { key: "satMath", label: "SAT math", group: "Academics", type: "text",
      synonyms: ["sat math", "math sat"] },
    { key: "satReading", label: "SAT reading / EBRW", group: "Academics", type: "text",
      synonyms: ["sat reading", "sat ebrw", "sat verbal", "evidence based reading", "reading writing sat", "ebrw"] },
    { key: "actComposite", label: "ACT composite", group: "Academics", type: "text",
      synonyms: ["act composite", "act score", "composite act", "act"],
      anti: ["math", "english", "science", "reading", "sat", "contact", "react", "fact"] },
    { key: "ncaaId", label: "NCAA Eligibility Center ID", group: "Academics", type: "text",
      synonyms: ["ncaa id", "ncaa eligibility", "eligibility center", "ncaa number", "ncaa registration", "ncaa eligibility number", "ncaa account"] },
    { key: "intendedMajor", label: "Intended major / academic interest", group: "Academics", type: "text",
      synonyms: ["intended major", "academic interest", "area of study", "field of study", "major", "academic major", "intended field"] },

    // ---- Athletics ----
    { key: "sport", label: "Sport", group: "Athletics", type: "text",
      synonyms: ["sport", "sport of interest", "which sport"], anti: ["sportsmanship"] },
    { key: "primaryPosition", label: "Primary position", group: "Athletics", type: "text",
      synonyms: ["primary position", "position", "positions", "position played", "playing position", "main position"],
      anti: ["secondary", "other position", "job", "title"] },
    { key: "secondaryPosition", label: "Secondary position", group: "Athletics", type: "text",
      synonyms: ["secondary position", "other position", "2nd position", "alternate position"] },
    { key: "jerseyNumber", label: "Jersey number", group: "Athletics", type: "text",
      synonyms: ["jersey number", "uniform number", "jersey", "jersey no", "number worn"], anti: ["phone", "id", "ssn", "ncaa", "license"] },
    { key: "heightFeet", label: "Height — feet", group: "Athletics", type: "number",
      synonyms: ["height feet", "feet", "height ft", "ht feet"], anti: ["inches", "weight"] },
    { key: "heightInches", label: "Height — inches", group: "Athletics", type: "number",
      synonyms: ["height inches", "inches", "height in", "ht inches"], anti: ["feet", "weight"] },
    { key: "heightCombined", label: "Height", group: "Athletics", type: "text", editable: false,
      derive: (p) => (p.heightFeet ? `${p.heightFeet}'${p.heightInches || 0}"` : ""),
      synonyms: ["height", "ht"], anti: ["feet", "inches", "weight"] },
    { key: "weight", label: "Weight (lbs)", group: "Athletics", type: "number",
      synonyms: ["weight", "weight lbs", "lbs", "pounds", "body weight"], anti: ["height"] },
    { key: "dominantFoot", label: "Dominant / preferred foot", group: "Athletics", type: "enum",
      options: ["Right", "Left", "Both"],
      synonyms: ["dominant foot", "preferred foot", "strong foot", "footedness", "foot"], anti: ["hand"] },
    { key: "dominantHand", label: "Dominant hand", group: "Athletics", type: "enum",
      options: ["Right", "Left", "Both"],
      synonyms: ["dominant hand", "throwing hand", "shooting hand", "handedness", "bats", "throws", "handed"], anti: ["foot"] },
    { key: "yearsPlayed", label: "Years playing", group: "Athletics", type: "text",
      synonyms: ["years played", "years playing", "years of experience", "experience years"] },

    // ---- Athletic Measurables (sport-specific metrics; fill only what applies) ----
    { key: "fortyYardDash", label: "40-yard dash (sec)", group: "Athletic Measurables", type: "text",
      synonyms: ["40 yard dash", "40 yd dash", "40 time", "forty yard dash", "forty time", "40 dash"], anti: ["60", "100", "shuttle"] },
    { key: "sixtyYardDash", label: "60-yard dash (sec)", group: "Athletic Measurables", type: "text",
      synonyms: ["60 yard dash", "60 yd dash", "60 time", "sixty yard dash"], anti: ["40", "100"] },
    { key: "verticalJump", label: "Vertical jump (in)", group: "Athletic Measurables", type: "text",
      synonyms: ["vertical jump", "vertical leap", "standing vertical", "vert", "vertical"], anti: ["reach", "approach", "broad"] },
    { key: "broadJump", label: "Broad jump (in)", group: "Athletic Measurables", type: "text",
      synonyms: ["broad jump", "standing long jump", "standing broad jump"] },
    { key: "proAgility", label: "Pro agility / 5-10-5 shuttle (sec)", group: "Athletic Measurables", type: "text",
      synonyms: ["pro agility", "20 yard shuttle", "short shuttle", "5 10 5", "shuttle run", "agility shuttle"] },
    { key: "threeConeDrill", label: "3-cone drill (sec)", group: "Athletic Measurables", type: "text",
      synonyms: ["3 cone", "three cone", "l drill", "3 cone drill"] },
    { key: "benchPress", label: "Bench press (max / reps)", group: "Athletic Measurables", type: "text",
      synonyms: ["bench press", "bench max", "bench reps", "225 bench"] },
    { key: "exitVelocity", label: "Exit velocity (mph)", group: "Athletic Measurables", type: "text",
      synonyms: ["exit velocity", "exit velo"] },
    { key: "throwingVelocity", label: "Throwing velocity (mph)", group: "Athletic Measurables", type: "text",
      synonyms: ["throwing velocity", "throwing velo", "arm velocity", "outfield velocity", "infield velocity", "position velocity", "of velocity", "if velocity"],
      anti: ["exit", "pitching", "fastball"] },
    { key: "pitchingVelocity", label: "Pitching velocity (mph)", group: "Athletic Measurables", type: "text",
      synonyms: ["pitching velocity", "pitching velo", "fastball velocity", "fb velocity", "mound velocity", "top pitching velocity"],
      anti: ["exit", "throwing", "outfield", "infield"] },
    { key: "wingspan", label: "Wingspan (in)", group: "Athletic Measurables", type: "text",
      synonyms: ["wingspan", "wing span", "arm span"] },
    { key: "standingReach", label: "Standing reach (in)", group: "Athletic Measurables", type: "text",
      synonyms: ["standing reach", "reach height", "standing touch"], anti: ["approach"] },
    { key: "approachTouch", label: "Approach touch / spike reach (in)", group: "Athletic Measurables", type: "text",
      synonyms: ["approach touch", "approach jump", "spike touch", "block touch", "approach reach", "approach"] },
    { key: "bestEvents", label: "Best events & times (track / swim / etc.)", group: "Athletic Measurables", type: "text",
      synonyms: ["best events", "best times", "event times", "personal records", "pr times", "top events", "best marks"] },

    // ---- Club & High School Teams ----
    { key: "clubTeamName", label: "Club / travel team name", group: "Club & High School Teams", type: "text",
      synonyms: ["club team", "club name", "club team name", "travel team", "select team", "academy team", "academy", "ecnl", "ga club", "current club", "club"],
      anti: ["high school", "coach", "email", "phone", "league"] },
    { key: "clubLeague", label: "Club league / division", group: "Club & High School Teams", type: "text",
      synonyms: ["club league", "league", "division", "club division"], anti: ["high school"] },
    { key: "clubCoachName", label: "Club coach name", group: "Club & High School Teams", type: "text",
      synonyms: ["club coach name", "club coach", "travel coach", "academy coach", "club coach first"], anti: ["email", "phone", "high school"] },
    { key: "clubCoachEmail", label: "Club coach email", group: "Club & High School Teams", type: "email",
      synonyms: ["club coach email", "club coach e mail", "travel coach email", "academy coach email"] },
    { key: "clubCoachPhone", label: "Club coach phone", group: "Club & High School Teams", type: "tel",
      synonyms: ["club coach phone", "club coach cell", "travel coach phone", "academy coach phone"] },
    { key: "hsCoachName", label: "High school coach name", group: "Club & High School Teams", type: "text",
      synonyms: ["high school coach name", "high school coach", "hs coach", "head coach name", "head coach", "coach name", "varsity coach", "coach"],
      anti: ["email", "phone", "club", "cell"] },
    { key: "hsCoachEmail", label: "High school coach email", group: "Club & High School Teams", type: "email",
      synonyms: ["high school coach email", "hs coach email", "head coach email", "coach email", "coach e mail"], anti: ["club"] },
    { key: "hsCoachPhone", label: "High school coach phone", group: "Club & High School Teams", type: "tel",
      synonyms: ["high school coach phone", "hs coach phone", "head coach phone", "coach phone", "coach cell"], anti: ["club"] },

    // ---- Parent / Guardian ----
    { key: "parent1Name", label: "Parent / guardian name", group: "Parent / Guardian", type: "text",
      synonyms: ["parent name", "guardian name", "parent guardian name", "parent first", "mother name", "father name", "parent 1 name", "parent guardian", "parent", "guardian", "mother", "father"],
      anti: ["email", "phone", "cell", "coach", "parent 2", "second"] },
    { key: "parent1Email", label: "Parent / guardian email", group: "Parent / Guardian", type: "email",
      synonyms: ["parent email", "guardian email", "parent guardian email", "mother email", "father email", "parent 1 email"], anti: ["parent 2", "second"] },
    { key: "parent1Phone", label: "Parent / guardian phone", group: "Parent / Guardian", type: "tel",
      synonyms: ["parent phone", "guardian phone", "parent cell", "parent guardian phone", "mother phone", "father phone", "parent 1 phone"], anti: ["parent 2", "second"] },
    { key: "parent1Relationship", label: "Relationship to athlete", group: "Parent / Guardian", type: "enum",
      options: ["Mother", "Father", "Guardian"],
      synonyms: ["relationship to athlete", "relationship to student", "parent relationship", "relationship"], anti: ["status"] },
    { key: "parent2Name", label: "2nd parent / guardian name", group: "Parent / Guardian", type: "text",
      synonyms: ["parent 2 name", "second parent name", "second guardian", "parent 2", "secondary parent"], anti: ["email", "phone"] },
    { key: "parent2Email", label: "2nd parent / guardian email", group: "Parent / Guardian", type: "email",
      synonyms: ["parent 2 email", "second parent email", "secondary parent email"] },
    { key: "parent2Phone", label: "2nd parent / guardian phone", group: "Parent / Guardian", type: "tel",
      synonyms: ["parent 2 phone", "second parent phone", "secondary parent phone"] },

    // ---- Recruiting Media ----
    { key: "highlightVideoUrl", label: "Highlight video URL (Hudl / YouTube)", group: "Recruiting Media", type: "text",
      synonyms: ["highlight video", "highlight film", "hudl", "video link", "video url", "film link", "highlights", "highlight reel", "youtube link", "game film"] },
    { key: "twitterHandle", label: "Twitter / X handle", group: "Recruiting Media", type: "text",
      synonyms: ["twitter handle", "twitter", "x handle"] },
    { key: "instagramHandle", label: "Instagram handle", group: "Recruiting Media", type: "text",
      synonyms: ["instagram handle", "instagram", "insta", "ig handle"] },
    { key: "personalWebsite", label: "Recruiting profile / website", group: "Recruiting Media", type: "text",
      synonyms: ["personal website", "recruiting profile", "website", "profile link", "ncsa profile", "fieldlevel"] },

    // ---- Derived helpers ----
    { key: "fullName", label: "Full name", group: "Athlete", type: "text", editable: false,
      derive: (p) => [p.firstName, p.lastName].filter(Boolean).join(" "),
      synonyms: ["full name", "your name", "athlete name", "student name", "player name", "name of athlete", "name of student", "prospect name", "name"],
      anti: PARENT_ANTI.concat(["coach", "school", "club", "team", "user", "company", "city", "event", "first", "last", "middle", "file"]) }
  ];

  window.RECRUIT_SCHEMA = FIELDS;
  window.RECRUIT_US_STATES = US_STATES;
  // Groups in display order (deduped, preserving first appearance).
  window.RECRUIT_GROUPS = FIELDS.reduce((acc, f) => {
    if (!acc.includes(f.group)) acc.push(f.group);
    return acc;
  }, []);
})();
