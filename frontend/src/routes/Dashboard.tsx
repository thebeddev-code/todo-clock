import { DayVisualizer } from "~/features/visualizer/components/DayVisualizer";
// import { useTodoForm } from "@/features/todos/stores/todoForm.store";
// import { TodoFormWrapper } from "@/features/todos/TodoFormWrapper";
// import { TodoList } from "@/features/todos/TodoList";
import { addDays, set } from "date-fns";
import {
	Accessor,
	createEffect,
	createMemo,
	createSignal,
	Show,
} from "solid-js";
import { Todo } from "~/lib/types";
import { createAsync } from "@solidjs/router";
import { getTodos } from "~/features/todos/api/getTodos";
import { TodoList } from "~/features/todos/components/TodoList";
import { TodoForm } from "~/features/todos/components/TodoForm";
import { TodoFormDrawer } from "~/features/todos/components/TodoFormDrawer";
import {
	openTodoForm,
	setTodoFormStore,
	todoFormStore,
} from "~/features/todos/components/todoFormStore";
import type { VisualizableTodo } from "~/features/visualizer/utils/types";

export default function Dashboard() {
	const todosQueryResult = createAsync(() => getTodos({}));
	const [currentDate, setCurrentDate] = createSignal(new Date());
	// const { data, status } = useTodos({
	//   params: {
	//     due: "today",
	//   },
	// });
	// const changeFormType = useTodoForm((state) => state.changeFormType);
	const todos = createMemo(() => todosQueryResult() ?? []);
	return (
		<div class="flex">
			<div class="w-50 h-dvh">Kinda sidebar</div>
			<main class="flex-1 h-dvh grid grid-cols-2">
				{/* {status === "success" && todos && ( */}
				<Show when={todosQueryResult()}>
					<DayVisualizer
						todos={createMemo(() => {
							const t = todosQueryResult() ?? [];
							return [...t, todoFormStore.todoData ?? {}] as VisualizableTodo[];
						})}
						currentDate={currentDate}
						onMoveDate={(days) => {
							let date = set(currentDate(), {
								hours: 0,
								minutes: 5,
								seconds: 0,
							});
							if (days < 0) {
								date = set(currentDate(), {
									hours: 23,
									minutes: 55,
									seconds: 0,
								});
							}
							setCurrentDate(addDays(date, days));
						}}
						onFormOpen={(todo) => {
							openTodoForm("create", todo);
						}}
					/>
					<TodoList todos={todos} />
				</Show>
				{/* )} */}
				{/* {status === "success" && todos && <TodoList todos={todos} />} */}
				<TodoFormDrawer />
			</main>
		</div>
	);
}
