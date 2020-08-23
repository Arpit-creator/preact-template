import React from "react";
import { render } from "react-dom";
import App from "@/components/app";

if (process.env.NODE_ENV === "development") {
	require("preact/devtools");
	require("preact/debug");
}

render(<App message="Hello World!" />, document.getElementById("root"));

if (process.env.NODE_ENV === "production") {
  navigator.serviceWorker.register("/service-worker.js");
}

// Show a offline error message when the use is offline
document.addEventListener("DOMContentLoaded", () => {
  if (!navigator.onLine) {
    document.getElementById("root").innerHTML = "<div class=\"offline\">You are currently offline...</div>";
  }
}, false);
