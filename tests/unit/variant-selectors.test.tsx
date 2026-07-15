import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { SizeSelector, VariantSelector } from "@/components/VariantSelectors";

describe("selectoare variante", () => {
  it("marcheaza marimile fara stoc si permite alegerea uneia disponibile", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <SizeSelector sizes={["S", "M"]} stock={{ S: 2, M: 0 }} value={null} onChange={onChange} />,
    );

    expect(screen.getByRole("button", { name: "Mărimea M, indisponibilă" })).toBeDisabled();
    await user.click(screen.getByRole("button", { name: "Mărimea S" }));
    expect(onChange).toHaveBeenCalledWith("S");
  });

  it("expune culoarea selectata prin aria-pressed", () => {
    render(
      <VariantSelector
        colors={[{ name: "Crem", hex: "#f1ead9" }]}
        value="Crem"
        onChange={() => undefined}
      />,
    );

    expect(screen.getByRole("button", { name: "Culoarea Crem" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });
});
