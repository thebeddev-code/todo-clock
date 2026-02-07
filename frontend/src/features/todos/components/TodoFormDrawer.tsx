import { X } from "lucide-solid";
import { Show } from "solid-js";
import { cn } from "~/lib/utils/cn";
import { TodoForm } from "./TodoForm";
import { closeTodoForm, todoFormStore } from "./todoFormStore";

export function TodoFormDrawer() {
	return (
		<div
			role="dialog"
			aria-modal="true"
			aria-labelledby="todo-heading"
			aria-hidden={!todoFormStore.formType}
			class={cn(
				"right-0 min-w-dvw min-h-dvh bg-black/20 fixed opacity-100 z-50 transition-colors duration-400 ease-in-out flex justify-end",
				{
					"-z-10 opacity-0 bg-transparent pointer-events-none":
						!todoFormStore.formType,
				},
			)}
			onKeyDown={(e) => {
				if (e.key === "Escape") closeTodoForm();
				e.stopPropagation();
			}}
		>
			{/* Backdrop - close drawer */}
			<button
				type="button"
				class="flex-1"
				onClick={closeTodoForm}
				aria-label="Close todo form"
			/>

			{/* Drawer content */}
			<div
				class={cn(
					"relative w-1/2 max-h-dvh overflow-y-auto bg-background shadow-2xl",
					"transition-transform duration-400 ease-in-out",
					"border-l border-border/50",
					{
						"translate-x-0": todoFormStore.formType,
						"translate-x-full": !todoFormStore.formType,
					},
				)}
			>
				<Show when={todoFormStore.formType}>
					<header class="sticky top-0 z-10 p-6 border-b bg-background text-foreground backdrop-blur-sm">
						<div class="flex items-center justify-between">
							<h2 id="todo-heading" class="text-2xl font-bold">
								{todoFormStore.formType === "update" ? "Edit Todo" : "New Todo"}
							</h2>
							<button
								type="button"
								onClick={closeTodoForm}
								class="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
								aria-label="Close form"
							>
								<X />
							</button>
						</div>
					</header>

					<div class="p-6">
						<TodoForm />
					</div>
				</Show>
			</div>
		</div>
	);
}
