"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
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
import {
  getPlayerSession,
  savePlayerSession,
} from "@/lib/player-session";
import type { Question, QuestionType } from "@/types/question";

interface LiveQuestion {
  sessionQuestionId: string;
  state: string;
  question: {
    id: string;
    type: QuestionType;
    prompt: string;
    timeLimitSeconds: number;
    config: Record<string, unknown>;
  };
}

export default function PlayPage() {
  const router = useRouter();
  const [demoIndex, setDemoIndex] = useState(0);
  const [live, setLive] = useState<LiveQuestion | null>(null);
  const [isDemo, setIsDemo] = useState(false);
  const [checkedSession, setCheckedSession] = useState(false);
  const submittedRef = useRef(false);

  const poll = useCallback(async () => {
    const stored = getPlayerSession();
    if (!stored) {
      setIsDemo(true);
      setCheckedSession(true);
      return;
    }

    try {
      const res = await fetch(
        `/api/sessions/${stored.sessionId}/current-question`,
      );
      const data = await res.json();
      setCheckedSession(true);

      if (data.state === "active") {
        submittedRef.current = false;
        setLive(data);
      } else if (data.state === "closed" || data.state === "revealed") {
        if (!submittedRef.current) {
          // Timer ran out and the player never answered - still move
          // them to the submitted/result flow rather than stranding
          // them on a dead question.
          router.push("/play/submitted");
        }
      }
    } catch {
      // keep retrying silently
    }
  }, [router]);

  useEffect(() => {
    poll();
    const interval = setInterval(poll, 1500);
    return () => clearInterval(interval);
  }, [poll]);

  async function submitAnswer(answer: unknown) {
    const stored = getPlayerSession();
    if (!stored || !live) return;
    submittedRef.current = true;

    try {
      await fetch("/api/answers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionQuestionId: live.sessionQuestionId,
          playerId: stored.playerId,
          answer,
        }),
      });
      savePlayerSession({
        ...stored,
        lastSessionQuestionId: live.sessionQuestionId,
      });
    } catch {
      // fall through - /play/submitted will still show, and the
      // player can be re-synced by the next poll if this failed
    }
    router.push("/play/submitted");
  }

  // ---- Not in a live session: fall back to the design-preview demo ----
  if (checkedSession && isDemo) {
    const question = sampleQuestions[demoIndex];
    return (
      <div className="min-h-screen flex flex-col">
        <PlayerHeader
          status="Demo preview"
          progressPct={((demoIndex + 1) / sampleQuestions.length) * 100}
        />
        <main className="flex-1 pt-24 px-5 pb-6 flex flex-col max-w-md mx-auto w-full">
          <div className="flex flex-col items-center pb-2">
            <CountdownTimer seconds={15} key={question.id} />
            <span className="mt-3 inline-block px-3 py-1 rounded-full bg-surface text-text-muted font-mono-caps text-[10px] tracking-widest border border-disabled/60">
              QUESTION {demoIndex + 1} OF {sampleQuestions.length} &middot;{" "}
              {question.category.toUpperCase()}
            </span>
            <h1 className="font-display font-bold text-xl text-text text-center mt-3 px-2">
              {question.prompt}
            </h1>
          </div>

          <div className="mt-6">
            <DemoQuestionBody question={question} />
          </div>

          <p className="mt-6 flex items-center justify-center gap-2 text-sm text-text-muted">
            <Users size={16} className="text-secondary animate-pulse" />
            No live session joined - showing preview data
          </p>

          <div className="mt-8 flex flex-wrap gap-2 justify-center border-t border-disabled pt-4">
            {sampleQuestions.map((q, i) => (
              <button
                key={q.id}
                onClick={() => setDemoIndex(i)}
                className={`text-xs px-3 py-1.5 rounded-full border ${
                  i === demoIndex
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

  // ---- Live session, waiting on the host to launch a question ----
  if (!live) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <PlayerHeader status="Waiting" />
        <p className="text-text-muted mt-16">Waiting for the next question...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <PlayerHeader status="Question live" />
      <main className="flex-1 pt-24 px-5 pb-6 flex flex-col max-w-md mx-auto w-full">
        <div className="flex flex-col items-center pb-2">
          <CountdownTimer
            seconds={live.question.timeLimitSeconds}
            key={live.sessionQuestionId}
          />
          <h1 className="font-display font-bold text-xl text-text text-center mt-3 px-2">
            {live.question.prompt}
          </h1>
        </div>

        <div className="mt-6">
          <LiveQuestionBody live={live} onAnswer={submitAnswer} />
        </div>
      </main>
    </div>
  );
}

function DemoQuestionBody({ question }: { question: Question }) {
  if (question.type === "multiple_choice")
    return <MultipleChoicePlayer question={question} />;
  if (question.type === "true_false") return <TrueFalsePlayer />;
  if (question.type === "open_text")
    return <OpenTextPlayer maxLength={question.maxLength} />;
  if (question.type === "word_cloud")
    return <WordCloudPlayer maxWordsPerPlayer={question.maxWordsPerPlayer} />;
  if (question.type === "rating_scale")
    return (
      <RatingScalePlayer
        min={question.min}
        max={question.max}
        minLabel={question.minLabel}
        maxLabel={question.maxLabel}
      />
    );
  if (question.type === "ranking")
    return <RankingPlayer items={question.items} />;
  if (question.type === "image_choice")
    return <ImageChoicePlayer options={question.options} />;
  return null;
}

function LiveQuestionBody({
  live,
  onAnswer,
}: {
  live: LiveQuestion;
  onAnswer: (answer: unknown) => void;
}) {
  const { type, config } = live.question;

  if (type === "multiple_choice" || type === "image_choice") {
    const options = config.options as { id: string; label: string; text?: string; imageUrl?: string }[];
    if (type === "image_choice") {
      return (
        <ImageChoicePlayer
          options={options as { id: string; label: string; imageUrl: string }[]}
          onAnswer={onAnswer}
        />
      );
    }
    return (
      <MultipleChoicePlayer
        question={{
          id: live.question.id,
          type: "multiple_choice",
          category: "",
          prompt: live.question.prompt,
          options: options as { id: string; label: string; text: string }[],
          correctOptionId: "",
        }}
        onAnswer={onAnswer}
      />
    );
  }
  if (type === "true_false") return <TrueFalsePlayer onAnswer={onAnswer} />;
  if (type === "open_text")
    return (
      <OpenTextPlayer
        maxLength={config.maxLength as number | undefined}
        onAnswer={onAnswer}
      />
    );
  if (type === "word_cloud")
    return (
      <WordCloudPlayer
        maxWordsPerPlayer={config.maxWordsPerPlayer as number | undefined}
        onAnswer={onAnswer}
      />
    );
  if (type === "rating_scale")
    return (
      <RatingScalePlayer
        min={config.min as number}
        max={config.max as number}
        minLabel={config.minLabel as string | undefined}
        maxLabel={config.maxLabel as string | undefined}
        onAnswer={onAnswer}
      />
    );
  if (type === "ranking")
    return (
      <RankingPlayer
        items={config.items as { id: string; label: string }[]}
        onAnswer={onAnswer}
      />
    );
  return null;
}
