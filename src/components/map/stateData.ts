import { MOCK_BILLS } from "@/lib/mockData";
import type { Bill } from "@/lib/types";

export const FIPS_TO_STATE: Record<string, { name: string; abbr: string }> = {
  "01": { name: "Alabama", abbr: "AL" },
  "02": { name: "Alaska", abbr: "AK" },
  "04": { name: "Arizona", abbr: "AZ" },
  "05": { name: "Arkansas", abbr: "AR" },
  "06": { name: "California", abbr: "CA" },
  "08": { name: "Colorado", abbr: "CO" },
  "09": { name: "Connecticut", abbr: "CT" },
  "10": { name: "Delaware", abbr: "DE" },
  "11": { name: "District of Columbia", abbr: "DC" },
  "12": { name: "Florida", abbr: "FL" },
  "13": { name: "Georgia", abbr: "GA" },
  "15": { name: "Hawaii", abbr: "HI" },
  "16": { name: "Idaho", abbr: "ID" },
  "17": { name: "Illinois", abbr: "IL" },
  "18": { name: "Indiana", abbr: "IN" },
  "19": { name: "Iowa", abbr: "IA" },
  "20": { name: "Kansas", abbr: "KS" },
  "21": { name: "Kentucky", abbr: "KY" },
  "22": { name: "Louisiana", abbr: "LA" },
  "23": { name: "Maine", abbr: "ME" },
  "24": { name: "Maryland", abbr: "MD" },
  "25": { name: "Massachusetts", abbr: "MA" },
  "26": { name: "Michigan", abbr: "MI" },
  "27": { name: "Minnesota", abbr: "MN" },
  "28": { name: "Mississippi", abbr: "MS" },
  "29": { name: "Missouri", abbr: "MO" },
  "30": { name: "Montana", abbr: "MT" },
  "31": { name: "Nebraska", abbr: "NE" },
  "32": { name: "Nevada", abbr: "NV" },
  "33": { name: "New Hampshire", abbr: "NH" },
  "34": { name: "New Jersey", abbr: "NJ" },
  "35": { name: "New Mexico", abbr: "NM" },
  "36": { name: "New York", abbr: "NY" },
  "37": { name: "North Carolina", abbr: "NC" },
  "38": { name: "North Dakota", abbr: "ND" },
  "39": { name: "Ohio", abbr: "OH" },
  "40": { name: "Oklahoma", abbr: "OK" },
  "41": { name: "Oregon", abbr: "OR" },
  "42": { name: "Pennsylvania", abbr: "PA" },
  "44": { name: "Rhode Island", abbr: "RI" },
  "45": { name: "South Carolina", abbr: "SC" },
  "46": { name: "South Dakota", abbr: "SD" },
  "47": { name: "Tennessee", abbr: "TN" },
  "48": { name: "Texas", abbr: "TX" },
  "49": { name: "Utah", abbr: "UT" },
  "50": { name: "Vermont", abbr: "VT" },
  "51": { name: "Virginia", abbr: "VA" },
  "53": { name: "Washington", abbr: "WA" },
  "54": { name: "West Virginia", abbr: "WV" },
  "55": { name: "Wisconsin", abbr: "WI" },
  "56": { name: "Wyoming", abbr: "WY" },
};

export interface StateProfile {
  focus: string;
  topTopics: string[];
  highlight: string;
  emoji: string;
}

export const STATE_PROFILES: Record<string, StateProfile> = {
  AL: { focus: "Agriculture & Manufacturing", topTopics: ["jobs", "rural", "education"], highlight: "Low-income households, rural communities", emoji: "🌾" },
  AK: { focus: "Energy & Natural Resources", topTopics: ["environment", "energy", "rural"], highlight: "Energy workers, indigenous communities", emoji: "🛢️" },
  AZ: { focus: "Healthcare & Housing", topTopics: ["healthcare", "housing", "immigration"], highlight: "Retirees, border communities, renters", emoji: "🌵" },
  AR: { focus: "Agriculture & Healthcare", topTopics: ["healthcare", "jobs", "rural"], highlight: "Rural workers, uninsured residents", emoji: "🌽" },
  CA: { focus: "Tech, Housing & Climate", topTopics: ["housing", "technology", "environment", "education"], highlight: "Renters, tech workers, students, climate-affected communities", emoji: "🌉" },
  CO: { focus: "Energy & Outdoor Economy", topTopics: ["environment", "energy", "jobs"], highlight: "Energy workers, outdoor recreation industry, skiers", emoji: "🏔️" },
  CT: { focus: "Finance & Insurance", topTopics: ["finance", "healthcare", "education"], highlight: "Financial services workers, students, insured residents", emoji: "🏦" },
  DE: { focus: "Corporate & Finance", topTopics: ["finance", "taxes", "healthcare"], highlight: "Corporate employees, small business owners", emoji: "🏛️" },
  FL: { focus: "Healthcare & Seniors", topTopics: ["healthcare", "housing", "seniors"], highlight: "Retirees, healthcare workers, hurricane-affected families", emoji: "🌴" },
  GA: { focus: "Agriculture & Tech", topTopics: ["jobs", "education", "healthcare"], highlight: "Agricultural workers, students, rural communities", emoji: "🍑" },
  HI: { focus: "Tourism & Environment", topTopics: ["environment", "jobs", "housing"], highlight: "Tourism workers, native Hawaiian communities, renters", emoji: "🌺" },
  ID: { focus: "Agriculture & Rural", topTopics: ["rural", "jobs", "education"], highlight: "Agricultural workers, rural families, small businesses", emoji: "🥔" },
  IL: { focus: "Manufacturing & Education", topTopics: ["jobs", "education", "housing"], highlight: "Manufacturing workers, students, Chicago renters", emoji: "🏙️" },
  IN: { focus: "Auto & Manufacturing", topTopics: ["jobs", "healthcare", "taxes"], highlight: "Auto workers, manufacturing employees, rural Hoosiers", emoji: "🏭" },
  IA: { focus: "Agriculture & Rural", topTopics: ["rural", "jobs", "education"], highlight: "Farmers, rural families, ethanol workers", emoji: "🌽" },
  KS: { focus: "Agriculture & Energy", topTopics: ["rural", "energy", "jobs"], highlight: "Wheat farmers, wind energy workers, rural communities", emoji: "🌾" },
  KY: { focus: "Coal & Healthcare", topTopics: ["jobs", "healthcare", "rural"], highlight: "Coal miners, rural communities, uninsured residents", emoji: "⛏️" },
  LA: { focus: "Energy & Environment", topTopics: ["energy", "environment", "jobs"], highlight: "Oil & gas workers, coastal communities, seafood industry", emoji: "🦐" },
  ME: { focus: "Maritime & Rural", topTopics: ["rural", "healthcare", "jobs"], highlight: "Fishing communities, lobster industry, rural residents", emoji: "🦞" },
  MD: { focus: "Government & Healthcare", topTopics: ["healthcare", "jobs", "education"], highlight: "Federal employees, defense contractors, suburban families", emoji: "🦀" },
  MA: { focus: "Education & Biotech", topTopics: ["education", "healthcare", "technology"], highlight: "Students, researchers, biotech & pharma workers", emoji: "🎓" },
  MI: { focus: "Auto & Manufacturing", topTopics: ["jobs", "environment", "education"], highlight: "Auto workers, manufacturing employees, Detroit residents", emoji: "🚗" },
  MN: { focus: "Agriculture & Healthcare", topTopics: ["healthcare", "rural", "education"], highlight: "Farmers, healthcare workers, Native American communities", emoji: "🌲" },
  MS: { focus: "Agriculture & Poverty", topTopics: ["healthcare", "rural", "jobs"], highlight: "Medicaid recipients, rural communities, agricultural workers", emoji: "🌊" },
  MO: { focus: "Agriculture & Manufacturing", topTopics: ["jobs", "healthcare", "rural"], highlight: "Farm families, auto workers, Gateway City residents", emoji: "🌉" },
  MT: { focus: "Mining & Ranching", topTopics: ["environment", "rural", "energy"], highlight: "Ranchers, miners, Native American tribes", emoji: "🦌" },
  NE: { focus: "Agriculture & Rural", topTopics: ["rural", "jobs", "education"], highlight: "Corn & soy farmers, meatpacking workers, rural families", emoji: "🌽" },
  NV: { focus: "Gaming & Tourism", topTopics: ["jobs", "housing", "healthcare"], highlight: "Casino & hospitality workers, retirees, Las Vegas residents", emoji: "🎰" },
  NH: { focus: "Manufacturing & Small Business", topTopics: ["taxes", "healthcare", "education"], highlight: "Small business owners, no-income-tax residents, students", emoji: "🏔️" },
  NJ: { focus: "Pharma & Finance", topTopics: ["healthcare", "taxes", "education"], highlight: "Pharma workers, NYC commuters, dense suburban families", emoji: "🧬" },
  NM: { focus: "Energy & Indigenous", topTopics: ["environment", "energy", "healthcare"], highlight: "Native American communities, oil & gas workers, rural residents", emoji: "☀️" },
  NY: { focus: "Finance & Housing", topTopics: ["housing", "finance", "healthcare", "education"], highlight: "NYC renters, financial sector workers, upstate farmers", emoji: "🗽" },
  NC: { focus: "Agriculture & Banking", topTopics: ["jobs", "healthcare", "education"], highlight: "Agricultural workers, banking employees, research triangle students", emoji: "🏦" },
  ND: { focus: "Energy & Agriculture", topTopics: ["energy", "rural", "jobs"], highlight: "Oil workers, wheat farmers, rural communities", emoji: "🛢️" },
  OH: { focus: "Manufacturing & Healthcare", topTopics: ["jobs", "healthcare", "education"], highlight: "Auto & steel workers, opioid-affected communities, students", emoji: "🏭" },
  OK: { focus: "Energy & Native Nations", topTopics: ["energy", "jobs", "rural"], highlight: "Oil & gas workers, farmers, 39 tribal nations", emoji: "🛢️" },
  OR: { focus: "Tech & Environment", topTopics: ["environment", "technology", "housing"], highlight: "Portland tech workers, timber industry, rural communities", emoji: "🌲" },
  PA: { focus: "Energy & Manufacturing", topTopics: ["energy", "jobs", "healthcare"], highlight: "Shale workers, steelworkers, rural Pennsylvanians, students", emoji: "⚙️" },
  RI: { focus: "Healthcare & Education", topTopics: ["healthcare", "education", "jobs"], highlight: "Healthcare workers, students, fishing industry", emoji: "⚓" },
  SC: { focus: "Manufacturing & Tourism", topTopics: ["jobs", "healthcare", "taxes"], highlight: "Auto & aircraft workers, retirees, coastal communities", emoji: "🌊" },
  SD: { focus: "Agriculture & Tribal", topTopics: ["rural", "healthcare", "jobs"], highlight: "Farmers, Native American tribes, rural Dakotans", emoji: "🌾" },
  TN: { focus: "Healthcare & Music", topTopics: ["healthcare", "jobs", "education"], highlight: "Healthcare workers, auto workers, Nashville creative industry", emoji: "🎵" },
  TX: { focus: "Energy, Agriculture & Immigration", topTopics: ["energy", "jobs", "healthcare", "education"], highlight: "Energy sector, 2M+ uninsured Texans, agricultural workers", emoji: "🤠" },
  UT: { focus: "Tech & Outdoor Recreation", topTopics: ["technology", "education", "jobs"], highlight: "Silicon Slopes tech workers, families, outdoor recreation industry", emoji: "🏔️" },
  VT: { focus: "Agriculture & Rural Healthcare", topTopics: ["healthcare", "rural", "environment"], highlight: "Dairy farmers, rural communities, uninsured residents", emoji: "🍁" },
  VA: { focus: "Government & Defense", topTopics: ["jobs", "healthcare", "education"], highlight: "Federal employees, defense contractors, veterans", emoji: "🏛️" },
  WA: { focus: "Tech & Environment", topTopics: ["technology", "environment", "healthcare"], highlight: "Amazon/Microsoft workers, agricultural communities, tribal nations", emoji: "☕" },
  WV: { focus: "Coal & Rural Health", topTopics: ["jobs", "healthcare", "rural"], highlight: "Coal miners, opioid-affected families, rural communities", emoji: "⛏️" },
  WI: { focus: "Dairy & Manufacturing", topTopics: ["jobs", "rural", "healthcare"], highlight: "Dairy farmers, auto & paper workers, rural residents", emoji: "🧀" },
  WY: { focus: "Energy & Ranching", topTopics: ["energy", "rural", "environment"], highlight: "Coal & gas workers, ranchers, wide-open rural communities", emoji: "🐄" },
};

export function getBillsForState(stateAbbr: string): Bill[] {
  const profile = STATE_PROFILES[stateAbbr];
  if (!profile) return MOCK_BILLS.filter((b) => b.trending).slice(0, 4);

  const scored = MOCK_BILLS.map((bill) => {
    let score = bill.trending ? 4 : 0;
    bill.topics.forEach((t) => {
      if (profile.topTopics.includes(t)) score += 6;
    });
    score += bill.trendScore / 25;
    return { bill, score };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map((s) => s.bill);
}
