import { createTypedQuery } from "~/lib/client";
import { TODO_QUERY_KEYS } from "../lib/constants";

export const createGetTodoQuery = (todoId: number) =>
	createTypedQuery<"/todos/[id]", "GET">(async (_, api) => {
		return await api.get(`/todos/${todoId}`);
	}, TODO_QUERY_KEYS.todo(todoId));
