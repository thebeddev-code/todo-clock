import { createTypedQuery } from "~/lib/client";
import { TODO_QUERY_KEYS } from "../lib/constants";

export const getTodos = createTypedQuery<"/todos", "GET">(
	async (options, api) => {
		const todos = await api.get("/todos", options);
		return todos ?? [];
	},
	TODO_QUERY_KEYS.todos,
);
