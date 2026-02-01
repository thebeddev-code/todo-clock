import { CreateTodo, GetTodos } from "../../../wailsjs/go/services/TodoService";
import { services } from "../../../wailsjs/go/models.ts";
import { Todo } from "../types";
export async function createTodo({ body }: { body: services.Todo }) {
  console.log(body)
  console.log(await CreateTodo(body))
}

export async function getTodos() {
  return GetTodos()
}

export function updateTodo() {

}

export function deleteTodo() {

}
