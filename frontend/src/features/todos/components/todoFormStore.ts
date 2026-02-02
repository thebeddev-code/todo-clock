import { createStore } from "solid-js/store";
import { Todo } from "~/lib/types";


export type TodoFormStore = {
  formType: "create" | "update" | "readonly" | null
  todoData?: Partial<Todo> | null
}
// Initialize store
export const [todoFormStore, setTodoFormStore] = createStore<TodoFormStore>({
  formType: null,
})
