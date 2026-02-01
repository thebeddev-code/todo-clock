import { revalidate } from "@solidjs/router";
import { api, createTypedQuery } from "~/lib/client";

export const createTodo = createTypedQuery<"/todos", "POST">(async (options) => {
  await api.create("/todos", options)
  revalidate("/todos")
}, "/todos")
