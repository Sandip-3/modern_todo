import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { UserProvider } from "./context/userContext/index.tsx";
import { TaskProvider } from "./context/taskContext/index.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <UserProvider>
    <TaskProvider>
      <BrowserRouter>
        <React.StrictMode>
          <App />
        </React.StrictMode>
      </BrowserRouter>
    </TaskProvider>
  </UserProvider>
);
