"use client";

import { useState } from "react";
import { sampleQuestions } from "./sample-questions";
import MultipleChoicePlayer from "@/components/questions/MultipleChoicePlayer";
import TrueFalsePlayer from "@/components/questions/TrueFalsePlayer";
import OpenTextPlayer from "@/components/questions/OpenTextPlayer";
import WordCloudPlayer from "@/components/questions/WordCloudPlayer";
import RatingScalePlayer from "@/components/questions/RatingScalePlayer";
import RankingPlayer from "@/components/questions/RankingPlayer";
import ImageChoicePlayer from "@/components/questions/ImageChoicePlayer";
import CountdownTimer from "@/components/CountdownTimer";
import PlayerHeader from "@/components/PlayerHeader";
import { Users } from "lucide-react";

export default function PlayPage() {
  const [index, setIndex] = useState(0);
  const question = sampleQuestions[index];

  return (
    <div className="min-h-screen flex flex-col">
      <PlayerHeader status="Question live" />
      <main className="flex-1 pt-24 px-5 pb-6 flex flex-col max-w-md mx-auto w-full">
        <div className="flex flex-col items-center pb-2">
          <CountdownTimer seconds={15} key={question.id} />
          <span className="mt-3 inline-block px-3 py-1 rounded-full bg-surface text-text-muted font-mono-caps text-[10px] tracking-widest border border-disabled/60">
            QUESTION {index + 1} OF {sampleQuestions.length} &middot;{" "}
            {question.category.toUpperCase()}
          </span>
          <h1 className="font-display font-bold text-xl text-text text-center mt-3 px-2">
            {question.prompt}
          </h1>
        </div>

        <div className="mt-6">
          {question.type === "multiple_choice" && (
            <MultipleChoicePlayer question={question} />
          )}
          {question.type === "true_false" && <TrueFalsePlayer />}
          {question.type === "open_text" && (
            <OpenTextPlayer maxLength={question.maxLength} />
          )}
          {question.type === "word_cloud" && (
            <WordCloudPlayer maxWordsPerPlayer={question.maxWordsPerPlayer} />
          )}
          {question.type === "rating_scale" && (
            <RatingScalePlayer
              min={question.min}
              max={question.max}
              minLabel={question.minLabel}
              maxLabel={question.maxLabel}
            />
          )}
          {question.type === "ranking" && (
            <RankingPlayer items={question.items} />
          )}
          {question.type === "image_choice" && (
            <ImageChoicePlayer options={question.options} />
          )}
        </div>

        <p className="mt-6 flex items-center justify-center gap-2 text-sm text-text-muted">
          <Users size={16} className="text-secondary animate-pulse" />
          42 players still in
        </p>

        {/* Dev-only preview switcher - lets you flip through all seven
            question types without needing a live host session yet. */}
        <div className="mt-8 flex flex-wrap gap-2 justify-center border-t border-disabled pt-4">
          {sampleQuestions.map((q, i) => (
            <button
              key={q.id}
              onClick={() => setIndex(i)}
              className={`text-xs px-3 py-1.5 rounded-full border ${
                i === index
                  ? "bg-primary text-white border-primary"
                  : "border-disabled text-text-muted"
              }`}
            >
              {q.type}
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}
