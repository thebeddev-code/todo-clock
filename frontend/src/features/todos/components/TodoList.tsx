import { Plus } from "lucide-solid";
import { type Accessor, For } from "solid-js";
import { Button } from "~/lib/components/ui/button";
import type { Todo } from "~/lib/types";
import { TodoItem } from "./TodoItem";
import { openTodoForm } from "./todoFormStore";

export function TodoList({ todos }: { todos: Accessor<Todo[]> }) {
	return (
		<section class="h-dvh w-full overflow-y-auto bg-background p-4 border-l border-border">
			<div class="flex justify-center mb-4">
				<Button
					variant="secondary"
					class="transition-colors duration-200 w-30 border hover:bg-(--accent-hover) bg-muted border-border 
					text-foreground hover:border-accent hover:text-background shadow-none"
					onClick={() => openTodoForm("create")}
				>
					<Plus />
				</Button>
			</div>

			<ul class="flex flex-col gap-4">
				<For each={todos()}>
					{(item) => (
						<li
							onClick={(e) => {
								e.stopPropagation();
								openTodoForm("update", item);
							}}
							onKeyDown={(e) => {
								if (e.key === "Enter" || e.key === " ") {
									e.preventDefault();
									openTodoForm("update", item);
								}
							}}
						>
							<TodoItem todo={item} />
						</li>
					)}
				</For>
			</ul>
		</section>
	);
}
