import { query } from "@solidjs/router";
import { invoke } from "@tauri-apps/api/core";
import { api } from "~/lib/client";
import { Todo } from "~/lib/types";

interface Params {
  page?: number;
  pageSize?: number;
  asc?: string;
  desc?: string;
  due?: "today" | "tommorow" | string;
}

export const getTodos = query(async () => {
  const todos = (await api.get("/todos")) as Todo[]
  return todos ?? [];
}, "todos");




