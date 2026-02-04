import { revalidate } from "@solidjs/router";
import { createTypedQuery } from "~/lib/client";

export const updateTodoMutation = createTypedQuery<"/todos/[id]", "PATCH">(
	async (options, api) => {
		await api.update(`/todos/${options.id}`, options);
		revalidate("/todos");
	},
	"/todos",
);
