import type { ProgramPlan, Category } from "@/types/types";

const CS_PLAN: ProgramPlan = {
  1: [
    { code: "COR1201", name: "Calculus", categories: ["Math", "Core"], units: 1, sem: 1, notes: "Numeracy" },
    { code: "COR3001", name: "Big Questions", category: "Core", units: 1, sem: 1 },
    { code: "CS101", name: "Programming Fundamentals I", category: "Major", units: 1, sem: 1 },
    { code: "IS211", name: "Interaction Design and Prototyping", category: "Major", units: 1, sem: 1 },
    { code: "CS104", name: "Mathematical Foundations of Computing", categories: ["Math", "Major"], units: 1, sem: 1 },
    { code: "CS102", name: "Programming Fundamentals II", category: "Major", units: 1, sem: 2, prereqs: ["CS101"] },
    { code: "CS105", name: "Statistical Thinking for Data Science", categories: ["Math", "Major"], units: 1, sem: 2, prereqs: ["COR1201"] },
    { code: "IS112", name: "Data Management", category: "Major", units: 1, sem: 2 },
    { code: "CS106", name: "Computer Architecture", category: "Major", units: 1, sem: 2, prereqs: ["CS101"] },
  ],
  2: [
    { code: "CS103", name: "Linear Algebra for Computing Applications", categories: ["Math", "Major"], units: 1, sem: 1 },
    { code: "CS201", name: "Data Structures and Algorithms", category: "Major", units: 1, sem: 1, prereqs: ["CS102"] },
    { code: "CS203", name: "Collaborative Software Development", category: "Major", units: 1, sem: 1, prereqs: ["CS102"] },
    { code: "CS205", name: "Operating Systems", category: "Major", units: 1, sem: 1, prereqs: ["CS102", "CS106"] },
    { code: "CS202", name: "Design and Analysis of Algorithms", category: "Major", units: 1, sem: 2, prereqs: ["CS201"] },
    { code: "CS204", name: "Computer Networks", category: "Major", units: 1, sem: 2 },
    { code: "CS206", name: "Software Product Management", category: "Major", units: 1, sem: 2, prereqs: ["IS211", "CS203"] },
    { code: "CS", name: "CS Declared Track Course #1", category: "Major", units: 1, sem: 2 },
  ],
  3: [
    { code: "CS301", name: "IT Solution Architecture", category: "Major", units: 1, sem: 1, prereqs: ["CS204"] },
    { code: "CS302", name: "IT Solution Lifecycle Management", category: "Major", units: 1, sem: 1, prereqs: ["CS203"] },
    { code: "CSPE", name: "Computer Science Project Experience", category: "Major", units: 1, sem: 2 },
    { code: "ETH301", name: "Ethics & Society", category: "GE", units: 1, sem: 2 },
  ],
  4: [
    { code: "CS401", name: "Capstone Project", category: "Core", units: 2, sem: 0, notes: "Year-long capstone if available" },
    { code: "CS420", name: "Introduction to Artificial Intelligence", category: "Major", units: 1, sem: 1 },
    { code: "CS440", name: "Foundations of Cybersecurity", category: "Major", units: 1, sem: 1 },
    { code: "CS464", name: "Full Stack Development", category: "Major", units: 1, sem: 1 },
    { code: "FREE1", name: "Free Elective", category: "Elective", units: 1, sem: 2 },
  ],
};

const IS_PLAN: ProgramPlan = {
  1: [
    { code: "COR-STAT1202", name: "Introductory Statistics", categories: ["Math", "Core"], units: 1, sem: 1 },
    { code: "COR-IS1704", name: "Computational Thinking and Programming", category: "Major", units: 1, sem: 1 },
    { code: "IS112", name: "Data Management", category: "Major", units: 1, sem: 2 },
    { code: "COR1100", name: "Writing and Reasoning", category: "GE", units: 1, sem: 2 },
  ],
  2: [
    { code: "IS201", name: "Business Process Analysis", category: "Major", units: 1, sem: 1 },
    { code: "IS211", name: "Interaction Design and Prototyping", category: "Major", units: 1, sem: 1 },
    { code: "IS202", name: "Systems Analysis & Design", category: "Major", units: 1, sem: 2 },
  ],
  3: [
    { code: "IS301", name: "Enterprise Architecture", category: "Major", units: 1, sem: 1 },
    { code: "IS302", name: "Platform Strategy", category: "Major", units: 1, sem: 2 },
  ],
  4: [
    { code: "IS401", name: "Capstone Project", category: "Core", units: 2, sem: 0 },
    { code: "FREE1", name: "Free Elective", category: "Elective", units: 1, sem: 2 },
  ],
};

const ECONS_PLAN: ProgramPlan = {
  1: [
    { code: "COR1201", name: "Calculus", categories: ["Math", "Core"], units: 1, sem: 1, notes: "Numeracy" },
    { code: "COR3001", name: "Big Questions", category: "Core", units: 1, sem: 1 },
    { code: "ECON101", name: "Principles of Microeconomics", category: "Major", units: 1, sem: 1 },
    { code: "COR-STAT1203", name: "Introduction to Statistical Theory", categories: ["Math", "Major"], units: 1, sem: 2 },
    { code: "ECON102", name: "Principles of Macroeconomics", category: "Major", units: 1, sem: 2, prereqs: ["ECON101"] },
    { code: "COR1100", name: "Writing and Reasoning", category: "GE", units: 1, sem: 2 },
  ],
  2: [
    { code: "ECON201", name: "Intermediate Microeconomics", category: "Major", units: 1, sem: 1, prereqs: ["ECON101", "COR1201"] },
    { code: "ECON202", name: "Intermediate Macroeconomics", category: "Major", units: 1, sem: 1, prereqs: ["ECON102"] },
    { code: "ECON230", name: "Econometrics I", categories: ["Math", "Major"], units: 1, sem: 1, prereqs: ["STAT1201", "COR1201"] },
    { code: "ECON231", name: "Econometrics II", categories: ["Math", "Major"], units: 1, sem: 2, prereqs: ["ECON230"] },
    { code: "ECON240", name: "Game Theory", category: "Major", units: 1, sem: 2, prereqs: ["ECON201"] },
    { code: "ETH301", name: "Ethics & Society", category: "GE", units: 1, sem: 2 },
  ],
  3: [
    { code: "ECON310", name: "International Economics", category: "Major", units: 1, sem: 1, prereqs: ["ECON201", "ECON202"] },
    { code: "ECON320", name: "Industrial Organization", category: "Major", units: 1, sem: 1, prereqs: ["ECON201"] },
    { code: "ECON330", name: "Development Economics", category: "Major", units: 1, sem: 2, prereqs: ["ECON201"] },
    { code: "ECON360", name: "Monetary Economics", category: "Major", units: 1, sem: 2, prereqs: ["ECON202"] },
  ],
  4: [
    { code: "ECON401", name: "Economics Capstone Seminar", category: "Core", units: 2, sem: 0, notes: "Year-long capstone/thesis-style seminar" },
    { code: "ECON4X1", name: "Major Elective 1", category: "Major", units: 1, sem: 1 },
    { code: "ECON4X2", name: "Major Elective 2", category: "Major", units: 1, sem: 1 },
    { code: "FREE1", name: "Free Elective", category: "Elective", units: 1, sem: 2 },
  ],
};

export const DEGREES: Record<string, { name: string; plan: ProgramPlan; aliases: string[] }> = {
  cs: { name: "Computer Science", plan: CS_PLAN, aliases: ["cs", "comp sci", "computer science"] },
  is: { name: "Information Systems", plan: IS_PLAN, aliases: ["is", "information systems"] },
  econs: { name: "Economics", plan: ECONS_PLAN, aliases: ["econs", "economics"] },
};

export const categoryStyles: Record<Category, string> = {
  Major: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/30",
  Core: "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/30",
  Math: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
  Elective: "bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/30",
  GE: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30",
};