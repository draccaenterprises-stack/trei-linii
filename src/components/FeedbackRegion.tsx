import { useId } from "react";

type FeedbackTone = "error" | "success" | "info";

export function FeedbackRegion({
  id,
  message,
  tone = "info",
  className,
}: {
  id?: string;
  message?: string | null;
  tone?: FeedbackTone;
  className?: string;
}) {
  const generatedId = useId();
  const isError = tone === "error";

  return (
    <p
      id={id || generatedId}
      role={isError ? "alert" : "status"}
      aria-live={isError ? "assertive" : "polite"}
      aria-atomic="true"
      className={[
        "font-mono-xs",
        tone === "error" && "text-red-700",
        tone === "success" && "text-olive",
        tone === "info" && "text-accent-text",
        !message && "sr-only",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {message || "Nicio notificare."}
    </p>
  );
}
