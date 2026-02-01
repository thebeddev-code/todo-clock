import { revalidate } from "@solidjs/router";
import { api, createTypedQuery } from "~/lib/client";

export const deleteTodoMutation = createTypedQuery<"/todos", "DELETE">(async (options) => {
  await api.delete("/todos", options)
  revalidate("/todos")
}, "/todos")
