import { createStore } from "solid-js/store";
import type { Todo } from "~/lib/types";

const CREATE_TODO_DEFAULT_DATA = {
	title: "",
	isRecurring: false,
	tags: [],
	createdAt: new Date().toISOString(),
	description: "",
	priority: "low",
	status: "pending",
	updatedAt: new Date().toISOString(),
	due: new Date().toISOString(),
	startsAt: new Date().toISOString(),
	recurrenceRule: "",
	monthlyDate: new Date().toString(),
	color: "rgb(0, 120, 255)",
};

export type FormTypes = "create" | "update" | null;

export type TodoFormStore = {
	formType: FormTypes;
	todoData?: Partial<Todo> | null;
};

export const [todoFormStore, setTodoFormStore] = createStore<TodoFormStore>({
	formType: null,
});

export const openTodoForm = (formType: FormTypes, todo?: Partial<Todo>) => {
	if (formType === "create") {
		return setTodoFormStore({
			formType,
			todoData: todo
				? structuredClone({ ...CREATE_TODO_DEFAULT_DATA, ...todo })
				: structuredClone(CREATE_TODO_DEFAULT_DATA),
		});
	}
	if (formType === "update" && todo) {
		return setTodoFormStore({
			formType,
			todoData: structuredClone(todo),
		});
	}
};

export const closeTodoForm = () =>
	setTodoFormStore({
		formType: null,
		todoData: structuredClone(CREATE_TODO_DEFAULT_DATA),
	});
