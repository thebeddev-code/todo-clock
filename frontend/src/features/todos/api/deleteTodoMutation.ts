import { revalidate } from "@solidjs/router";
import { createTypedQuery } from "~/lib/client";

export const deleteTodoMutation = createTypedQuery<"/todos/[id]", "DELETE">(
	async (options, api) => {
		await api.delete(`/todos/${options.id}`);
		revalidate("/todos");
	},
	"/todos",
);
