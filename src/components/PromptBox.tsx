"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export const DEMO_PROMPT = `I just moved into my apartment.
Make my home ready for tonight.
I have a $250 budget.`;

export const SUGGESTED_PROMPTS = [
  {
    label: "Get my apartment ready for tonight",
    value: DEMO_PROMPT,
  },
  {
    label: "Help me prepare for a birthday party",
    value: "Help me prepare for a birthday party this evening.",
  },
  {
    label: "I need help moving this weekend",
    value: "I need help moving this weekend. Packing, lifting, and furniture assembly.",
  },
  {
    label: "Fix everything that needs fixing in my apartment",
    value: "Fix everything that needs fixing in my apartment — leaks, outlets, and general repairs.",
  },
];

export function PromptBox({
  value,
  onChange,
  onSubmit,
}: {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
}) {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center">
      <p className="mb-3 text-xs font-medium tracking-[0.18em] text-amber-200/80 uppercase">
        Don&apos;t manage tasks. Describe the outcome.
      </p>
      <h1 className="font-heading text-center text-4xl leading-[1.1] tracking-tight text-zinc-50 sm:text-5xl">
        What do you want to get done?
      </h1>
      <p className="mt-4 max-w-lg text-center text-[15px] leading-relaxed text-zinc-400">
        Tell TaskFlow the outcome. Your AI agent will figure out the rest.
      </p>

      <div className="mt-10 w-full rounded-2xl border border-white/8 bg-zinc-900/70 p-3 shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_20px_60px_rgba(0,0,0,0.35)]">
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          rows={4}
          className="w-full resize-none bg-transparent px-3 py-2 text-[15px] leading-relaxed text-zinc-100 outline-none placeholder:text-zinc-600"
          placeholder={DEMO_PROMPT}
        />
        <div className="flex justify-end pt-1">
          <Button
            type="button"
            onClick={onSubmit}
            disabled={!value.trim()}
            className="h-10 gap-2 rounded-xl bg-amber-400 px-4 text-sm font-medium text-zinc-950 hover:bg-amber-300"
          >
            Build my plan
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-2">
        {SUGGESTED_PROMPTS.map((prompt) => (
          <button
            key={prompt.label}
            type="button"
            onClick={() => onChange(prompt.value)}
            className="rounded-full border border-white/8 bg-zinc-900/50 px-3 py-1.5 text-xs text-zinc-400 transition hover:border-white/16 hover:text-zinc-200"
          >
            {prompt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
