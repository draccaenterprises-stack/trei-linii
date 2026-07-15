import { describe, expect, it, vi } from "vitest";
import { contactPayloadSchema, createContactAdapter } from "@/lib/form-adapters";

describe("formular contact", () => {
  it("accepta un mesaj valid si curata spatiile", () => {
    const payload = contactPayloadSchema.parse({
      name: "  Ana Pop  ",
      email: "ana@example.com",
      subject: "Marime",
      message: "  Am nevoie de ajutor cu marimea potrivita.  ",
    });

    expect(payload.name).toBe("Ana Pop");
    expect(payload.message).toBe("Am nevoie de ajutor cu marimea potrivita.");
  });

  it("respinge emailul invalid si mesajele prea scurte", () => {
    expect(() =>
      contactPayloadSchema.parse({
        name: "Ana",
        email: "invalid",
        subject: "",
        message: "Salut",
      }),
    ).toThrow();
  });

  it("construiește un mailto sigur când endpoint-ul nu este configurat", async () => {
    const adapter = createContactAdapter({ endpoint: "", email: "contact@treilinii.ro" });
    const result = await adapter.submit({
      name: "Ana Pop",
      email: "ana@example.com",
      subject: "Ajutor marime",
      message: "Am nevoie de ajutor cu marimea potrivita.",
    });

    expect(result.kind).toBe("mailto");
    if (result.kind === "mailto") {
      expect(result.href).toMatch(/^mailto:contact@treilinii\.ro/);
      expect(result.href).toContain("Ajutor%20marime");
    }
  });

  it("trimite JSON prin endpoint HTTPS și mapează eroarea de rețea", async () => {
    const fetchOk = vi.fn().mockResolvedValue(new Response(null, { status: 204 }));
    const adapter = createContactAdapter({
      endpoint: "https://forms.example.com/contact",
      email: "",
      fetchImpl: fetchOk,
    });
    const payload = {
      name: "Ana Pop",
      email: "ana@example.com",
      subject: "Mărime",
      message: "Am nevoie de ajutor cu mărimea potrivită.",
    };

    await expect(adapter.submit(payload)).resolves.toEqual({ kind: "sent" });
    expect(fetchOk).toHaveBeenCalledOnce();

    const failing = createContactAdapter({
      endpoint: "https://forms.example.com/contact",
      email: "",
      fetchImpl: vi.fn().mockResolvedValue(new Response(null, { status: 500 })),
    });
    await expect(failing.submit(payload)).rejects.toThrow("Mesajul nu a putut fi trimis");
  });
});
