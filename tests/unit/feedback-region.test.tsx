import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FeedbackRegion } from "@/components/FeedbackRegion";

describe("FeedbackRegion", () => {
  it("anunță erorile și succesul prin live regions", () => {
    const { rerender } = render(<FeedbackRegion message="A apărut o eroare." tone="error" />);
    expect(screen.getByRole("alert")).toHaveTextContent("A apărut o eroare.");

    rerender(<FeedbackRegion message="Produs adăugat." tone="success" />);
    expect(screen.getByRole("status")).toHaveTextContent("Produs adăugat.");
  });
});
