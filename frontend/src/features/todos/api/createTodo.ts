import { revalidate } from "@solidjs/router";
import { createTypedQuery } from "~/lib/client";

export const createTodo = createTypedQuery<"/todos", "POST">(
	async (options, api) => {
		await api.create("/todos", options);
		revalidate("/todos");
	},
	"/todos",
);
