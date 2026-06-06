import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { pageMeta } from "@/lib/seo";

const CONTACT_ENDPOINT = import.meta.env.VITE_CONTACT_FORM_ENDPOINT as string | undefined;
const CONTACT_EMAIL = "contact@treilinii.ro";

export const Route = createFileRoute("/contact")({
  component: Contact,
  head: () =>
    pageMeta({
      path: "/contact",
      title: "Contact - Trei Linii",
      description: "Contact Trei Linii pentru comenzi, retururi, colaborari si intrebari generale.",
    }),
});

function Contact() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "mailto" | "error">("idle");
  return (
    <div className="px-5 md:px-10 py-12 md:py-20">
      <div className="mx-auto max-w-[1400px] grid md:grid-cols-12 gap-12">
        <div className="md:col-span-5">
          <p className="font-mono-xs opacity-60">Contact</p>
          <h1 className="font-display text-5xl md:text-7xl mt-2 leading-[0.95]">Scrie-ne.</h1>
          <div className="mt-12 space-y-8 font-mono-xs">
            <div>
              <h3 className="opacity-50 mb-2">Studio</h3>
              <p>Bucuresti, Romania</p>
            </div>
            <div>
              <h3 className="opacity-50 mb-2">Email</h3>
              <p>{CONTACT_EMAIL}</p>
            </div>
            <div>
              <h3 className="opacity-50 mb-2">Comenzi</h3>
              <p>support@treilinii.ro</p>
            </div>
            <div>
              <h3 className="opacity-50 mb-2">Colaborari</h3>
              <p>collab@treilinii.ro</p>
            </div>
          </div>
        </div>

        <div className="md:col-span-6 md:col-start-7">
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const form = e.currentTarget;
              const data = new FormData(form);
              const payload = {
                name: String(data.get("name") ?? ""),
                email: String(data.get("email") ?? ""),
                subject: String(data.get("subject") ?? "Mesaj client Trei Linii"),
                message: String(data.get("message") ?? ""),
              };

              if (CONTACT_ENDPOINT?.trim()) {
                setStatus("sending");
                try {
                  const response = await fetch(CONTACT_ENDPOINT, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                  });
                  if (!response.ok) throw new Error("Contact endpoint failed");
                  setStatus("sent");
                  form.reset();
                } catch {
                  setStatus("error");
                }
                return;
              }

              const body = [
                `Nume: ${payload.name}`,
                `Email: ${payload.email}`,
                "",
                payload.message,
              ].join("\n");
              window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
                payload.subject,
              )}&body=${encodeURIComponent(body)}`;
              setStatus("mailto");
            }}
            className="space-y-8"
          >
            <Field label="Nume">
              <input name="name" required className="input" />
            </Field>
            <Field label="Email">
              <input name="email" type="email" required className="input" />
            </Field>
            <Field label="Subiect">
              <input name="subject" className="input" />
            </Field>
            <Field label="Mesaj">
              <textarea name="message" rows={6} required className="input resize-none" />
            </Field>
            <button className="bg-charcoal text-cream px-6 py-3 font-mono-xs hover:bg-charcoal/90">
              {status === "sending"
                ? "Se trimite..."
                : CONTACT_ENDPOINT?.trim()
                  ? "Trimite mesajul"
                  : "Trimite pe email"}
            </button>
            {status === "sent" && (
              <p className="font-mono-xs text-olive">Mesaj trimis. Iti raspundem pe email.</p>
            )}
            {status === "mailto" && (
              <p className="font-mono-xs text-olive">
                S-a deschis aplicatia de email cu mesajul completat.
              </p>
            )}
            {status === "error" && (
              <p className="font-mono-xs text-red-700">
                Mesajul nu a putut fi trimis. Scrie-ne direct la {CONTACT_EMAIL}.
              </p>
            )}
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
