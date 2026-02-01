import { revalidate } from "@solidjs/router";
import { api, createTypedQuery } from "~/lib/client";

export const updateTodoMutation = createTypedQuery<"/todos/[id]", "PATCH">(async (options) => {
  await api.update<"/todos/[id]", "PATCH">(`/todos/${options.id}`, options)
  revalidate("/todos")
}, "/todos")
