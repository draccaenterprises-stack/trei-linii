import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/returns")({
  beforeLoad: () => {
    throw redirect({ to: "/retur", statusCode: 301 });
  },
});
