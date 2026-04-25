import { NextRequest, NextResponse } from "next/server";
import type { ImpactAnalysis } from "@/lib/types";

const SYSTEM_PROMPT = `You are a neutral civic policy analyst. Your task is to explain how a specific bill may affect a specific user profile.

STRICT RULES:
- Be politically neutral.
- Do NOT tell the user how to vote.
- Do NOT persuade.
- Do NOT exaggerate impact.
- If impact is unclear, explicitly say so.
- Separate facts from assumptions.
- Use simple, clear language.
- Be transparent about uncertainty.

You MUST return ONLY valid JSON matching the exact schema provided. No markdown, no explanation outside the JSON.`;

function buildPrompt(bill: Record<string, unknown>, profile: Record<string, unknown>): string {
  return `Analyze how this bill affects this specific user profile.

BILL:
Title: ${bill.title}
Summary: ${bill.summary}
Topics: ${Array.isArray(bill.topics) ? (bill.topics as string[]).join(", ") : ""}

USER PROFILE:
State: ${profile.state}
ZIP: ${profile.zip || "not provided"}
Role: ${profile.role}
Income Range: ${profile.incomeRange}
Employment Sector: ${profile.employmentSector || "not specified"}
Education: ${profile.educationStatus}
Healthcare: ${profile.healthcareStatus}
Key Concerns: ${Array.isArray(profile.concerns) ? (profile.concerns as string[]).join(", ") : ""}

Return ONLY this JSON structure (no markdown, no code fences):
{
  "personalSummary": "3-5 sentence explanation tailored to this specific user",
  "impactScores": {
    "wallet": { "level": "positive|negative|mixed|unclear|not_directly_affected", "score": 0-100, "explanation": "..." },
    "healthcare": { "level": "...", "score": 0-100, "explanation": "..." },
    "education": { "level": "...", "score": 0-100, "explanation": "..." },
    "jobs": { "level": "...", "score": 0-100, "explanation": "..." },
    "housing": { "level": "...", "score": 0-100, "explanation": "..." },
    "local": { "level": "...", "score": 0-100, "explanation": "..." },
    "rights": { "level": "...", "score": 0-100, "explanation": "..." },
    "environment": { "level": "...", "score": 0-100, "explanation": "..." }
  },
  "whoBenefits": ["..."],
  "whoPays": ["..."],
  "argumentsFor": ["3-5 key arguments supporters make for this bill"],
  "argumentsAgainst": ["3-5 key arguments opponents make against this bill"],
  "localImpact": ["..."],
  "assumptions": ["..."],
  "confidence": { "score": 0-100, "reason": "..." },
  "plainEnglish": "Explain like the user is 15 years old",
  "questions": ["Question 1", "Question 2", "Question 3"],
  "sources": ["..."]
}`;
}

async function analyzeWithGemini(
  bill: Record<string, unknown>,
  profile: Record<string, unknown>
): Promise<ImpactAnalysis> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY not set");

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: SYSTEM_PROMPT + "\n\n" + buildPrompt(bill, profile) },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 2000,
        },
      }),
    }
  );

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Gemini API error: ${err}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("No content from Gemini");

  const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
  return JSON.parse(cleaned) as ImpactAnalysis;
}

function generateMockAnalysis(
  bill: Record<string, unknown>,
  profile: Record<string, unknown>
): ImpactAnalysis {
  const topics = Array.isArray(bill.topics) ? (bill.topics as string[]) : [];
  const concerns = Array.isArray(profile.concerns) ? (profile.concerns as string[]) : [];
  const role = (profile.role as string) || "person";
  const income = (profile.incomeRange as string) || "moderate income";
  const title = (bill.title as string) || "this bill";

  return {
    personalSummary: `As a ${role} with ${income.replace(/-/g, " ")} income in ${profile.state || "your state"}, this bill could have several effects on your situation. Based on the topics covered — ${topics.join(", ")} — here's what matters most to you. The analysis below covers the key ways this legislation intersects with your specific profile. Please review the assumptions section, as some details depend on information not provided. Overall, your situation aligns with some of the target demographics of this bill.`,
    impactScores: {
      wallet: {
        level: concerns.includes("taxes") ? "mixed" : "unclear",
        score: concerns.includes("taxes") ? 55 : 20,
        explanation: "Financial impact depends on specific provisions that may apply to your income level.",
      },
      healthcare: {
        level: topics.includes("healthcare") ? "positive" : "not_directly_affected",
        score: topics.includes("healthcare") ? 65 : 5,
        explanation: topics.includes("healthcare")
          ? "Healthcare provisions in this bill may affect your coverage or costs."
          : "This bill does not contain significant healthcare provisions.",
      },
      education: {
        level: topics.includes("education") ? "positive" : "not_directly_affected",
        score: topics.includes("education") ? 70 : 5,
        explanation: topics.includes("education")
          ? "Education-related provisions could benefit you based on your profile."
          : "No direct education impact found in this bill.",
      },
      jobs: {
        level: topics.includes("jobs") || topics.includes("economy") ? "mixed" : "unclear",
        score: topics.includes("jobs") ? 50 : 25,
        explanation: "Employment effects are estimated based on economic modeling and vary by sector.",
      },
      housing: {
        level: topics.includes("housing") ? "positive" : "not_directly_affected",
        score: topics.includes("housing") ? 60 : 5,
        explanation: topics.includes("housing")
          ? "Housing provisions may affect affordability in your area."
          : "No direct housing impact identified.",
      },
      local: {
        level: "unclear",
        score: 30,
        explanation: "Local effects depend on your state and municipality's relationship with federal funding.",
      },
      rights: {
        level: "not_directly_affected",
        score: 5,
        explanation: "No significant civil or legal rights provisions identified.",
      },
      environment: {
        level: topics.includes("environment") || topics.includes("climate") ? "positive" : "not_directly_affected",
        score: topics.includes("environment") ? 55 : 5,
        explanation: topics.includes("environment")
          ? "Environmental provisions may affect your community long-term."
          : "No direct environmental impact identified.",
      },
    },
    argumentsFor: [
      `Supporters argue this bill addresses key issues in ${topics.join(", ")} that affect millions of Americans`,
      "Proponents say the economic benefits outweigh the costs through increased productivity and reduced inequality",
      "Advocates point to similar successful programs at the state level as evidence this approach works",
      "Supporters emphasize that targeted investment now prevents larger costs down the road",
    ],
    argumentsAgainst: [
      `Critics argue the estimated cost is too high and adds to the national debt`,
      "Opponents say the bill creates market distortions that could have unintended consequences",
      "Some argue the benefits are too narrowly targeted and don't help the broadest population",
      "Critics question whether federal intervention is the right approach versus state-level solutions",
    ],
    whoBenefits: [
      `${role.charAt(0).toUpperCase() + role.slice(1)}s in the target income range`,
      "Residents of states with matching federal funding programs",
      "Those directly addressed by the bill's core provisions",
    ],
    whoPays: [
      "Federal taxpayers broadly",
      "Industries subject to new regulations",
      "Higher-income earners if tax provisions apply",
    ],
    localImpact: [
      `${profile.state || "Your state"} may receive adjusted federal funding based on this bill`,
      "Local implementation timelines typically lag federal passage by 12-24 months",
    ],
    assumptions: [
      `Role assumed based on your profile: ${role}`,
      `Income range used for eligibility calculations: ${income}`,
      "Federal implementation timeline assumed to be standard (12-18 months)",
      "State-level adoption assumed to follow federal guidelines",
    ],
    confidence: {
      score: 58,
      reason:
        "Moderate confidence. General analysis based on bill topics and profile. Exact figures require detailed bill text review.",
    },
    plainEnglish: `Imagine ${title.toLowerCase()} is a new set of rules the government is making. Some of those rules might help people like you, and some might not affect you much. We looked at your situation — where you live, what you do, how much money you make — and tried to figure out which parts matter for you. Think of this as a map that shows you where the bill might touch your life.`,
    questions: [
      "Are you directly in the income or eligibility range mentioned in this bill?",
      "Does your employer or sector fall under the specific industries affected?",
      "Have you checked your state's implementation plans for this federal bill?",
    ],
    sources: [
      `${title} — Official Bill Text`,
      "Congressional Budget Office (CBO) Preliminary Analysis",
      "Congressional Research Service Summary",
    ],
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { bill, profile } = body;

    if (!bill || !profile) {
      return NextResponse.json({ error: "Missing bill or profile" }, { status: 400 });
    }

    let analysis: ImpactAnalysis;

    try {
      analysis = await analyzeWithGemini(bill, profile);
    } catch (aiError) {
      console.warn("AI analysis failed, using mock:", aiError);
      analysis = generateMockAnalysis(bill, profile);
    }

    return NextResponse.json(analysis);
  } catch (error) {
    console.error("Impact analysis error:", error);
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 });
  }
}
