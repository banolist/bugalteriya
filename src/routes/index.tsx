import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useAuth } from "~/context/AuthContext";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  const auth = useAuth();
  if (!auth.isAuthenticated) {
    return <Navigate to="/login" />;
  }
  return <Navigate to="/app" />;
}
