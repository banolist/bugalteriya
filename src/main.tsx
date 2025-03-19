import React from "react";
import ReactDOM from "react-dom/client";
import "./main.css";
import { RouterProvider, createRouter } from "@tanstack/react-router";
// Import the generated route tree
import { routeTree } from "./routeTree.gen";
import localizedFormat from "dayjs/plugin/localizedFormat"; // ES 2015
import dayjs from "dayjs";

dayjs.extend(localizedFormat);
// Create a new router instance
const router = createRouter({ routeTree });

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
