import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/delivery")({
  beforeLoad: () => {
    throw redirect({ to: "/livrare", statusCode: 301 });
  },
});
