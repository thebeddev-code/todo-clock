import { Plus } from "lucide-solid";
import { Button } from "~/lib/components/ui/button";
import type { Todo } from "~/lib/types";
import { TodoExpandedView } from "./TodoExpandedView";
import { TodoItem } from "./TodoItem";
import { type Accessor, createMemo, createSignal, For, Show } from "solid-js";
import { openTodoForm, setTodoFormStore } from "./todoFormStore";

export function TodoList({ todos }: { todos: Accessor<Todo[]> }) {
	const [expandedTodoId, setExpandedTodoId] = createSignal<null | number>(null);

	const expandedTodo = createMemo(() =>
		todos().find((t) => t.id == expandedTodoId()),
	);
	function handleShowTodoExpandedView(todoId: number) {
		setExpandedTodoId(todoId);
	}
	return (
		<div class="flex h-dvh w-full flex-col gap-2 overflow-y-auto rounded-lg bg-gray-50 p-4 border border-gray-200">
			<Show when={expandedTodo()}>
				<div
					onClick={() => setExpandedTodoId(null)}
					class="fixed inset-0 z-20 flex items-center justify-center bg-black/40"
				>
					<TodoExpandedView
						todo={expandedTodo() as Todo}
						onExpandedViewClose={() => setExpandedTodoId(null)}
					/>
				</div>
			</Show>
			<For each={todos()}>
				{(item) => (
					<TodoItem
						todo={item}
						onShowExpandedView={handleShowTodoExpandedView}
					/>
				)}
			</For>

			<div class="flex justify-center">
				<Button
					variant="secondary"
					class="w-30 border hover:border-blue-500"
					onClick={() => openTodoForm("create")}
				>
					<Plus class="text-slate-800" />
				</Button>
			</div>
		</div>
	);
}
