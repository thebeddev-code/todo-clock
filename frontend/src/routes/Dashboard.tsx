import { createAsync } from "@solidjs/router";
import { addDays, set } from "date-fns";
import { createMemo, createSignal, Show } from "solid-js";
import { getTodos } from "~/features/todos/api/getTodos";
import { TodoFormDrawer } from "~/features/todos/components/TodoFormDrawer";
import { TodoList } from "~/features/todos/components/TodoList";
import {
	openTodoForm,
	todoFormStore,
} from "~/features/todos/components/todoFormStore";
import { DayVisualizer } from "~/features/visualizer/components/DayVisualizer";
import type { VisualizableTodo } from "~/features/visualizer/utils/types";

export default function Dashboard() {
	const todosQueryResult = createAsync(() => getTodos());
	const [currentDate, setCurrentDate] = createSignal(new Date());
	const todos = createMemo(() => todosQueryResult() ?? []);

	return (
		<main class="w-full">
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
		</main>
	);
}
