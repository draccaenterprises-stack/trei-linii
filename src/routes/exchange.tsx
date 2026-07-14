import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/exchange")({
  beforeLoad: () => {
    throw redirect({ to: "/schimb-marime", statusCode: 301 });
  },
});
