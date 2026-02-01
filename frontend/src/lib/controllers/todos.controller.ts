import { CreateTodo, DeleteTodo, GetTodos } from "~/go/services/TodoService";
import { Todo } from "../types/index";
import { todoPayloadSchema } from "../schemas/todo.schema";
import z from "zod";

export async function createTodo({ body }: { body: Todo }) {
  try {
    const data = todoPayloadSchema.parse(body)
    await CreateTodo(data as Todo)
  } catch (e) {
    console.error("Bug in createTodo controller", e);
    throw new Error("Invalid todo data")
  }
}

export async function getTodos() {
  return GetTodos()
}

export function updateTodo() {

}

export function deleteTodo({ id }: { id: number }) {
  z.number().min(0).parse(id)
  DeleteTodo(id)
}
