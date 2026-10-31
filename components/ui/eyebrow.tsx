import type { ReactNode } from "react";

type EyebrowProps = {
  children: ReactNode;
  tone?: "light" | "dark";
};

export default function Eyebrow({ children, tone = "light" }: EyebrowProps) {
  return (
    <p
      className={`mb-0 flex items-center gap-3 text-[10px] font-bold tracking-[0.22em] ${
        tone === "dark" ? "text-stone" : "text-stone-light"
      }`}
    >
      <span className="inline-block h-px w-6 bg-gold" />
      {children}
    </p>
  );
}
