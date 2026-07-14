import * as React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const openCart = vi.fn();

vi.mock("@tanstack/react-router", () => ({
  Link: React.forwardRef<
    HTMLAnchorElement,
    React.AnchorHTMLAttributes<HTMLAnchorElement> & { to: string; activeProps?: unknown }
  >(({ to, activeProps: _activeProps, children, ...props }, ref) => (
    <a ref={ref} href={to} {...props}>
      {children}
    </a>
  )),
  useRouterState: ({
    select,
  }: {
    select: (state: { location: { pathname: string } }) => unknown;
  }) => select({ location: { pathname: "/" } }),
}));

vi.mock("@/lib/cart-context", () => ({
  useCart: () => ({ count: 2, open: openCart }),
}));

vi.mock("@/lib/site-context", () => ({
  useSite: () => ({
    accentColor: "#d40059",
    logoText: "Trei Linii",
    siteMode: "live-shop",
    announcement: "",
    announcementVisible: false,
    launchDate: "",
  }),
}));

vi.mock("@/components/ResponsiveImage", () => ({
  ResponsiveImage: ({ alt }: { alt: string }) => <img alt={alt} />,
}));

import { Header } from "@/components/Header";

describe("Header", () => {
  beforeEach(() => openCart.mockClear());

  it("expune cart count și deschide coșul", async () => {
    const user = userEvent.setup();
    render(<Header />);
    const cart = screen.getByRole("button", { name: "Deschide coșul, 2 produse" });
    await user.click(cart);
    expect(openCart).toHaveBeenCalledOnce();
  });

  it("deschide și închide meniul mobil cu tastatura", async () => {
    const user = userEvent.setup();
    render(<Header />);
    const trigger = screen.getByRole("button", { name: "Deschide meniul" });
    await user.click(trigger);
    expect(screen.getByRole("dialog", { name: "Navigație" })).toBeVisible();
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog", { name: "Navigație" })).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });
});
