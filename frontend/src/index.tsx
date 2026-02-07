/* @refresh reload */

import { Route, Router } from "@solidjs/router";
import { render } from "solid-js/web";
import "./index.css";
import { applyTheme } from "./lib/utils/theme.ts";
import Activities from "./routes/activities.tsx";
import DashboardLayout from "./routes/layout.tsx";
import Settings from "./routes/settings.tsx";

applyTheme();
render(
	() => (
		<Router root={DashboardLayout}>
			<Route path="/" component={Activities} />
			<Route path="/calendar" />
			<Route path="/settings" component={Settings} />
		</Router>
	),
	document.getElementById("root") as HTMLElement,
);
