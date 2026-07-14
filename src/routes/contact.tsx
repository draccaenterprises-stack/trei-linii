import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { FeedbackRegion } from "@/components/FeedbackRegion";
import {
  contactPayloadSchema,
  isContactChannelConfigured,
  isContactEndpointConfigured,
  submitContact,
} from "@/lib/form-adapters";
import { LEGAL } from "@/lib/site";
import { pageMeta } from "@/lib/seo";

const CONTACT_EMAIL = LEGAL.email;

export const Route = createFileRoute("/contact")({
  component: Contact,
  head: () =>
    pageMeta({
      path: "/contact",
      title: "Contact - Trei Linii",
      description: "Contact Trei Linii pentru comenzi, retururi, colaborări și întrebări generale.",
    }),
});

function Contact() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "mailto" | "error">("idle");
  const [errors, setErrors] = useState<
    Partial<Record<"name" | "email" | "subject" | "message", string>>
  >({});
  const formRef = useRef<HTMLFormElement>(null);
  const contactAvailable = isContactChannelConfigured();
  return (
    <div className="px-5 md:px-10 py-12 md:py-20">
      <div className="mx-auto max-w-[1400px] grid md:grid-cols-12 gap-12">
        <div className="md:col-span-5">
          <p className="font-mono-xs opacity-60">Contact</p>
          <h1 className="font-display text-5xl md:text-7xl mt-2 leading-[0.95]">Scrie-ne.</h1>
          <div className="mt-12 space-y-8 font-mono-xs">
            <div>
              <h3 className="mb-2 text-muted-foreground">Studio</h3>
              <p>București, România</p>
            </div>
            {CONTACT_EMAIL && (
              <div>
                <h3 className="opacity-50 mb-2">Email</h3>
                <a href={`mailto:${CONTACT_EMAIL}`} className="underline underline-offset-4">
                  {CONTACT_EMAIL}
                </a>
              </div>
            )}
          </div>
        </div>

        <div className="md:col-span-6 md:col-start-7">
          {contactAvailable ? (
            <form
              ref={formRef}
              noValidate
              onSubmit={async (e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const data = new FormData(form);
                const payloadResult = contactPayloadSchema.safeParse({
                  name: String(data.get("name") ?? ""),
                  email: String(data.get("email") ?? ""),
                  subject: String(data.get("subject") ?? "Mesaj client Trei Linii"),
                  message: String(data.get("message") ?? ""),
                });

                if (!payloadResult.success) {
                  const nextErrors: typeof errors = {};
                  const messages = {
                    name: "Introdu cel puțin 2 caractere.",
                    email: "Introdu o adresă de email validă.",
                    subject: "Subiectul poate avea cel mult 150 de caractere.",
                    message: "Mesajul trebuie să aibă între 10 și 5.000 de caractere.",
                  };
                  for (const issue of payloadResult.error.issues) {
                    const field = issue.path[0] as keyof typeof messages;
                    if (field in messages) nextErrors[field] = messages[field];
                  }
                  setErrors(nextErrors);
                  setStatus("idle");
                  const firstField = Object.keys(nextErrors)[0];
                  requestAnimationFrame(() => {
                    const control = form.elements.namedItem(firstField);
                    if (control instanceof HTMLElement) control.focus();
                  });
                  return;
                }

                setErrors({});
                setStatus("sending");
                try {
                  const result = await submitContact(payloadResult.data);
                  if (result.kind === "sent") {
                    setStatus("sent");
                    form.reset();
                  } else {
                    window.location.assign(result.href);
                    setStatus("mailto");
                  }
                } catch {
                  setStatus("error");
                }
              }}
              className="space-y-8"
            >
              <FeedbackRegion
                id="contact-form-feedback"
                message={
                  Object.keys(errors).length
                    ? "Verifică informațiile marcate în formular."
                    : status === "sent"
                      ? "Mesaj trimis. Îți răspundem pe email."
                      : status === "mailto"
                        ? "S-a deschis aplicația de email cu mesajul completat."
                        : status === "error"
                          ? CONTACT_EMAIL
                            ? `Mesajul nu a putut fi trimis. Scrie-ne direct la ${CONTACT_EMAIL}.`
                            : "Mesajul nu a putut fi trimis. Încearcă din nou peste câteva momente."
                          : null
                }
                tone={status === "error" || Object.keys(errors).length ? "error" : "success"}
              />

              <Field label="Nume" htmlFor="contact-name" error={errors.name}>
                <input
                  id="contact-name"
                  name="name"
                  required
                  minLength={2}
                  maxLength={100}
                  autoComplete="name"
                  className="form-input"
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? "contact-name-error" : undefined}
                />
              </Field>
              <Field label="Email" htmlFor="contact-email" error={errors.email}>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  required
                  maxLength={254}
                  autoComplete="email"
                  className="form-input"
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? "contact-email-error" : undefined}
                />
              </Field>
              <Field label="Subiect" htmlFor="contact-subject" error={errors.subject}>
                <input
                  id="contact-subject"
                  name="subject"
                  maxLength={150}
                  className="form-input"
                  aria-invalid={Boolean(errors.subject)}
                  aria-describedby={errors.subject ? "contact-subject-error" : undefined}
                />
              </Field>
              <Field label="Mesaj" htmlFor="contact-message" error={errors.message}>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={6}
                  required
                  minLength={10}
                  maxLength={5000}
                  className="form-input resize-none"
                  aria-invalid={Boolean(errors.message)}
                  aria-describedby={errors.message ? "contact-message-error" : undefined}
                />
              </Field>
              <button
                type="submit"
                disabled={status === "sending"}
                className="bg-charcoal text-cream px-6 py-3 font-mono-xs hover:bg-charcoal/90 disabled:opacity-50"
              >
                {status === "sending"
                  ? "Se trimite..."
                  : isContactEndpointConfigured()
                    ? "Trimite mesajul"
                    : "Trimite pe email"}
              </button>
            </form>
          ) : (
            <div className="border-y border-border py-10">
              <h2 className="font-display text-3xl">Canalul direct este în pregătire.</h2>
              <p className="mt-4 max-w-lg leading-relaxed text-muted-foreground">
                Datele de contact vor apărea aici înainte de activarea comenzilor. Pentru moment,
                poți consulta răspunsurile publicate în FAQ.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="block">
      <label htmlFor={htmlFor} className="font-mono-xs opacity-60">
        {label}
      </label>
      <div className="mt-1">{children}</div>
      {error && (
        <p id={`${htmlFor}-error`} className="mt-2 text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}
