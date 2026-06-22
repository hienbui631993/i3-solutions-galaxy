import React from "react";
import { createRoot } from "react-dom/client";
import App from "./i3-solution-universe.jsx";
import AuthGate from "./auth/AuthGate.jsx";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthGate>
      <App />
    </AuthGate>
  </React.StrictMode>
);
