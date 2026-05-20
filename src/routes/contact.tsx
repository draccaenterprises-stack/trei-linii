import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/contact")({
  component: Contact,
  head: () => ({
    meta: [
      { title: "Contact — BLANK ATELIER" },
      { name: "description", content: "Reach the studio. Press, wholesale, returns and general inquiries." },
    ],
  }),
});

function Contact() {
  const [sent, setSent] = useState(false);
  return (
    <div className="px-5 md:px-10 py-12 md:py-20">
      <div className="mx-auto max-w-[1400px] grid md:grid-cols-12 gap-12">
        <div className="md:col-span-5">
          <p className="font-mono-xs opacity-60">Contact</p>
          <h1 className="font-display text-5xl md:text-7xl mt-2 leading-[0.95]">Say hello.</h1>
          <div className="mt-12 space-y-8 font-mono-xs">
            <div>
              <h3 className="opacity-50 mb-2">Studio</h3>
              <p>Str. Lipscani 12<br />Bucharest, 030031</p>
            </div>
            <div>
              <h3 className="opacity-50 mb-2">Email</h3>
              <p>hello@blank-atelier.demo</p>
            </div>
            <div>
              <h3 className="opacity-50 mb-2">Press</h3>
              <p>press@blank-atelier.demo</p>
            </div>
            <div>
              <h3 className="opacity-50 mb-2">Wholesale</h3>
              <p>wholesale@blank-atelier.demo</p>
            </div>
          </div>
        </div>

        <div className="md:col-span-6 md:col-start-7">
          <form
            onSubmit={(e) => { e.preventDefault(); setSent(true); }}
            className="space-y-8"
          >
            <Field label="Name"><input required className="input" /></Field>
            <Field label="Email"><input type="email" required className="input" /></Field>
            <Field label="Subject"><input className="input" /></Field>
            <Field label="Message">
              <textarea rows={6} required className="input resize-none" />
            </Field>
            <button className="bg-charcoal text-cream px-6 py-3 font-mono-xs hover:bg-charcoal/90">
              {sent ? "Sent ✓" : "Send message →"}
            </button>
          </form>
        </div>
      </div>

      <style>{`
        .input {
          width: 100%; background: transparent; outline: none;
          border-bottom: 1px solid var(--color-border); padding: 8px 0;
          font-family: var(--font-sans);
        }
        .input:focus { border-color: var(--color-charcoal); }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="font-mono-xs opacity-60">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}
