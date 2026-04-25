export interface CivicProfile {
  state: string;
  zip: string;
  role: string;
  incomeRange: string;
  employmentSector: string;
  educationStatus: string;
  healthcareStatus: string;
  concerns: string[];
}

export type ImpactLevel =
  | "positive"
  | "negative"
  | "mixed"
  | "unclear"
  | "not_directly_affected";

export interface ImpactCategory {
  level: ImpactLevel;
  score: number;
  explanation: string;
}

export interface ImpactAnalysis {
  personalSummary: string;
  impactScores: {
    wallet: ImpactCategory;
    healthcare: ImpactCategory;
    education: ImpactCategory;
    jobs: ImpactCategory;
    housing: ImpactCategory;
    local: ImpactCategory;
    rights: ImpactCategory;
    environment: ImpactCategory;
  };
  argumentsFor: string[];
  argumentsAgainst: string[];
  whoBenefits: string[];
  whoPays: string[];
  localImpact: string[];
  assumptions: string[];
  confidence: {
    score: number;
    reason: string;
  };
  plainEnglish: string;
  questions: string[];
  sources: string[];
}

export interface Bill {
  id: string;
  title: string;
  shortTitle: string;
  summary: string;
  fullText?: string;
  topics: string[];
  status: "introduced" | "committee" | "passed_house" | "passed_senate" | "signed" | "vetoed";
  chamber: "house" | "senate" | "both";
  sponsor: string;
  sponsorParty: "D" | "R" | "I";
  introducedDate: string;
  lastActionDate: string;
  lastAction: string;
  state?: string;
  billNumber: string;
  trending: boolean;
  trendScore: number;
  tags: string[];
}

export interface DiscussionPost {
  id: string;
  billId: string;
  userId: string;
  displayName: string;
  content: string;
  type: "opinion" | "question" | "fact";
  upvotes: number;
  timestamp: string;
  aiModerated: boolean;
  sources?: string[];
}

export interface AudioSummaryRequest {
  billId: string;
  type: "impact_brief" | "sixty_second" | "debate";
  profile?: CivicProfile;
  text: string;
}
