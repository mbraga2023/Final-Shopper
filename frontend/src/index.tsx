import React from "react";
import ReactDOM from "react-dom/client"; // Import ReactDOM from react-dom/client
import App from "./App"; // Import your main App component

// Create root using React 18's new API
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

// Render the App component inside the root element, wrapped with StrictMode
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
