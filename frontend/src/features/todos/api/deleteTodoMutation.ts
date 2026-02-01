import { revalidate } from "@solidjs/router";
import { api, createTypedQuery } from "~/lib/client";

export const deleteTodoMutation = createTypedQuery<"/todos/[id]", "DELETE">(async (options) => {
  await api.delete(`/todos/${options.id}`);
  revalidate("/todos")
}, "/todos")
