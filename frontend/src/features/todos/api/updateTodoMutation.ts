import { revalidate } from "@solidjs/router";
import { createTypedQuery } from "~/lib/client";
import { TODO_QUERY_KEYS } from "../lib/constants";

export const updateTodoMutation = createTypedQuery<"/todos/[id]", "PATCH">(
	async (options, api) => {
		await api.update(`/todos/${options.id}`, options);
		revalidate(TODO_QUERY_KEYS.todos);
	},
	TODO_QUERY_KEYS.todos,
);
