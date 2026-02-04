import { createTypedQuery } from "~/lib/client";

export const getTodos = createTypedQuery<"/todos", "GET">(
	async (options, api) => {
		const todos = await api.get("/todos", options);
		return todos ?? [];
	},
	"/todos",
);
