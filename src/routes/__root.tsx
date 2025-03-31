import * as React from "react";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { AuthProvider } from "~/context/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { DatabaseProvider } from "~/context/databaseContext";
export const Route = createRootRoute({
  component: RootComponent,
});
const queryClient = new QueryClient();

function RootComponent() {
  return (
    <React.Fragment>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <DatabaseProvider>
            <div className="w-full h-full bg-base-200">
              <Outlet />
            </div>
          </DatabaseProvider>
        </AuthProvider>
      </QueryClientProvider>
    </React.Fragment>
  );
}
