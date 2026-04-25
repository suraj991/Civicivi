"use client";

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import type { ImpactAnalysis } from "@/lib/types";

interface Props {
  analysis: ImpactAnalysis;
}

export default function ImpactRadarChart({ analysis }: Props) {
  const data = [
    { subject: "Wallet", score: analysis.impactScores.wallet.score, fullMark: 100 },
    { subject: "Healthcare", score: analysis.impactScores.healthcare.score, fullMark: 100 },
    { subject: "Education", score: analysis.impactScores.education.score, fullMark: 100 },
    { subject: "Jobs", score: analysis.impactScores.jobs.score, fullMark: 100 },
    { subject: "Housing", score: analysis.impactScores.housing.score, fullMark: 100 },
    { subject: "Rights", score: analysis.impactScores.rights.score, fullMark: 100 },
    { subject: "Env.", score: analysis.impactScores.environment.score, fullMark: 100 },
    { subject: "Local", score: analysis.impactScores.local.score, fullMark: 100 },
  ];

  return (
    <ResponsiveContainer width="100%" height={280}>
      <RadarChart data={data} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
        <PolarGrid stroke="#1e293b" />
        <PolarAngleAxis
          dataKey="subject"
          tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: 500 }}
        />
        <Radar
          name="Impact"
          dataKey="score"
          stroke="#6366f1"
          fill="#6366f1"
          fillOpacity={0.2}
          strokeWidth={2}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#0f172a",
            border: "1px solid #1e293b",
            borderRadius: "12px",
            color: "#f1f5f9",
            fontSize: "12px",
          }}
          formatter={(value: number) => [`Score: ${value}`, ""]}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
