import React from "react";
import ReactDOM from "react-dom/client";
import Home from "./app/page";
import "./app/globals.css";

const rootElement = document.getElementById("root");

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <Home />
    </React.StrictMode>
  );
}
