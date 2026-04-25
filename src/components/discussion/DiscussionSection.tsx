"use client";

import { useState } from "react";
import { MOCK_DISCUSSION_POSTS } from "@/lib/mockData";
import type { DiscussionPost } from "@/lib/types";
import { ThumbsUp, MessageSquare, AlertCircle, BookOpen, Send, Bot, Check } from "lucide-react";

interface Props {
  billId: string;
}

const TYPE_CONFIG = {
  opinion: { icon: MessageSquare, color: "text-indigo-400", bg: "bg-indigo-500/10 border-indigo-500/20", label: "Opinion" },
  question: { icon: AlertCircle, color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20", label: "Question" },
  fact: { icon: BookOpen, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20", label: "Fact" },
};

export default function DiscussionSection({ billId }: Props) {
  const [posts, setPosts] = useState<DiscussionPost[]>(
    MOCK_DISCUSSION_POSTS.filter((p) => p.billId === billId)
  );
  const [content, setContent] = useState("");
  const [type, setType] = useState<"opinion" | "question" | "fact">("opinion");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim()) return;
    setSubmitting(true);

    const newPost: DiscussionPost = {
      id: `post-${Date.now()}`,
      billId,
      userId: "anonymous",
      displayName: "You",
      content: content.trim(),
      type,
      upvotes: 0,
      timestamp: new Date().toISOString(),
      aiModerated: false,
    };

    await new Promise((r) => setTimeout(r, 800));
    setPosts((prev) => [newPost, ...prev]);
    setContent("");
    setSubmitting(false);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2500);
  };

  const handleUpvote = (postId: string) => {
    setPosts((prev) => prev.map((p) => p.id === postId ? { ...p, upvotes: p.upvotes + 1 } : p));
  };

  const formatTime = (ts: string) => {
    const d = new Date(ts);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return "just now";
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <div className="space-y-6">
      {/* Compose */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-slate-300 mb-4">Share your perspective</h3>

        {/* Type selector */}
        <div className="flex gap-2 mb-3">
          {(["opinion", "question", "fact"] as const).map((t) => {
            const cfg = TYPE_CONFIG[t];
            const Icon = cfg.icon;
            return (
              <button
                key={t}
                onClick={() => setType(t)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                  type === t ? `${cfg.bg} ${cfg.color}` : "bg-slate-800 border-slate-700 text-slate-500 hover:text-slate-300"
                }`}
              >
                <Icon className="w-3.5 h-3.5" /> {cfg.label}
              </button>
            );
          })}
        </div>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={
            type === "opinion"
              ? "Share your opinion on this bill..."
              : type === "question"
              ? "Ask a question about this bill..."
              : "Share a verifiable fact with a source..."
          }
          rows={3}
          className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-slate-100 text-sm placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 transition-colors resize-none"
        />

        <div className="flex items-center justify-between mt-3">
          <p className="text-slate-600 text-xs flex items-center gap-1.5">
            <Bot className="w-3.5 h-3.5" /> AI-moderated for quality
          </p>
          <button
            onClick={handleSubmit}
            disabled={!content.trim() || submitting}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-sm font-semibold transition-all"
          >
            {submitted ? (
              <><Check className="w-3.5 h-3.5" /> Posted!</>
            ) : submitting ? (
              <><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Posting...</>
            ) : (
              <><Send className="w-3.5 h-3.5" /> Post</>
            )}
          </button>
        </div>
      </div>

      {/* Posts */}
      {posts.length === 0 ? (
        <div className="text-center py-10 text-slate-500">
          <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-40" />
          <p>No comments yet. Be the first!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map((post) => {
            const cfg = TYPE_CONFIG[post.type];
            const Icon = cfg.icon;
            return (
              <div
                key={post.id}
                className="bg-slate-900 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-300">
                      {post.displayName.charAt(0)}
                    </div>
                    <span className="text-slate-300 text-sm font-medium">{post.displayName}</span>
                    <span className="text-slate-600 text-xs">{formatTime(post.timestamp)}</span>
                  </div>
                  <div className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium border ${cfg.bg} ${cfg.color}`}>
                    <Icon className="w-3 h-3" /> {cfg.label}
                  </div>
                </div>

                <p className="text-slate-300 text-sm leading-relaxed mb-3">{post.content}</p>

                {post.sources && post.sources.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {post.sources.map((src, i) => (
                      <span key={i} className="text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded-lg">
                        📎 {src}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleUpvote(post.id)}
                    className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-indigo-400 transition-colors"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                    {post.upvotes > 0 && <span>{post.upvotes}</span>}
                  </button>
                  {post.aiModerated && (
                    <span className="flex items-center gap-1 text-xs text-slate-600">
                      <Bot className="w-3 h-3" /> AI moderated
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
