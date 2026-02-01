import { Todo } from "~/lib/types";
import { updateTodoMutation } from "./updateTodoMutation";

export const completeTodoMutation = (update: Pick<Todo, "id" | "completedAt" | "status">) => updateTodoMutation({
  id: update.id,
  body: update
})
