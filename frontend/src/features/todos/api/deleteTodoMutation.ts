import { revalidate } from "@solidjs/router";
import { createTypedQuery } from "~/lib/client";
import { TODO_QUERY_KEYS } from "../lib/constants";

export const deleteTodoMutation = createTypedQuery<"/todos/[id]", "DELETE">(
	async (options, api) => {
		await api.delete(`/todos/${options.id}`);
		revalidate(TODO_QUERY_KEYS.todos);
	},
	TODO_QUERY_KEYS.todos,
);
