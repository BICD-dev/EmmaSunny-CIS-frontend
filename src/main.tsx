import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { HashRouter } from "react-router-dom";
import { QueryProvider } from "./lib/QueryProvider.tsx";
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HashRouter>
      <QueryProvider>
        <App />
      </QueryProvider>
    </HashRouter>
  </StrictMode>
);
