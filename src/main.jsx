import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { store } from "./store/store";
import { hydrateAuth } from "./store/slices/authSlice";
import "./index.css";

// Hydrate auth from localStorage synchronously (no backend call needed)
const stored = localStorage.getItem("user");
if (stored) {
  try {
    store.dispatch(hydrateAuth(JSON.parse(stored)));
  } catch {
    /* ignore malformed */
  }
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);