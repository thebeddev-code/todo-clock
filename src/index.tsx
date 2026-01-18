/* @refresh reload */
import { render } from "solid-js/web";
import { Router, Route } from "@solidjs/router";
import "./index.css"
import Dashboard from "./routes/Dashboard.tsx";

render(() => (
  <Router>
    <Route path="/" component={Dashboard} />
  </Router>
), document.getElementById("root") as HTMLElement);
