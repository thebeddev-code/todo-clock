import { revalidate } from "@solidjs/router";
import { createTypedQuery } from "~/lib/client";
import { TODO_QUERY_KEYS } from "../lib/constants";

export const createTodo = createTypedQuery<"/todos", "POST">(
	async (options, api) => {
		await api.create("/todos", options);
		revalidate(TODO_QUERY_KEYS.todos);
	},
	TODO_QUERY_KEYS.todos,
);
