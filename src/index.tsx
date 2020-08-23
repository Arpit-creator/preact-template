import React from "react";
import { render } from "react-dom";
import App from "@/components/app";

if (process.env.NODE_ENV === "development") {
	require("preact/devtools");
	require("preact/debug");
}

render(<App message="Hello World!" />, document.getElementById("root"));
