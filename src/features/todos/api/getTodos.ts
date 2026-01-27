import { api, createTypedQuery } from "~/lib/client";

export const getTodos = createTypedQuery<"/todos", "GET">(async (options) => {
  const todos = (await api.get<"/todos", "GET">("/todos", options))
  return todos ?? [];
}, "/todos");




