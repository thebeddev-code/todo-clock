import { format } from "date-fns";
import { X as Close, SquarePen } from "lucide-solid";
import { Button } from "~/lib/components/ui/button";
import type { ClickEvent, Todo } from "~/lib/types";
import { deleteTodoMutation } from "../api/deleteTodoMutation";
import { completeTodoMutation } from "../api/completeTodoMutation";
import { setTodoFormStore } from "./todoFormStore";

type Props = {
	todo: Todo;
	onShowExpandedView?: (id: number) => void;
};
export function TodoItem({ todo, onShowExpandedView }: Props) {
	// const changeFormType = useTodoForm((state) => state.changeFormType);
	// const { mutate: deleteTodo } = useDeleteTodo({
	//   mutationConfig: {
	//     onError: () => {
	//       toast.error("Failed to delete todo");
	//     },
	//   },
	// });
	// const completeTodoMutation = useUpdateTodo({
	//   mutationConfig: {
	//     onError: () => {
	//       toast.error("Failed to update todo");
	//     },
	//   },
	// });
	function handleEditTodo() {
		setTodoFormStore({
			formType: "update",
			todoData: todo,
		});
	}
	function handleCompleteTodo() {
		if (todo.status === "completed") {
			completeTodoMutation({
				id: todo.id,
				completedAt: "",
				status: "pending",
			});
		} else {
			completeTodoMutation({
				id: todo.id,
				completedAt: new Date().toISOString(),
				status: "completed",
			});
		}
	}
	function handleDeleteTodo() {
		deleteTodoMutation({ id: todo.id });
	}

	const { title, due, priority, status, isRecurring, startsAt, color } = todo;
	const isCompleted = status === "completed";

	return (
		<div class="overflow-hidden relative bg-white rounded-md border border-gray-200 hover:border-gray-300 transition cursor-pointer">
			<div
				class="absolute h-40 w-40 rounded-full -top-10 -left-8"
				style={{
					background: `radial-gradient(ellipse at center, ${color}, transparent, transparent)`,
					opacity: "0.2",
				}}
			/>
			<div
				class="relative z-10 flex items-center justify-between gap-3 bg-transparent px-3 py-2 text-sm"
				onClick={(e) => {
					e.stopPropagation();
					handleEditTodo();
				}}
			>
				<button
					type="button"
					onClick={(e) => {
						e.stopPropagation();
						handleCompleteTodo();
					}}
					class={`flex h-4 w-4 items-center justify-center rounded border text-[10px] ${
						isCompleted
							? "border-emerald-500 bg-emerald-500 text-white"
							: "border-gray-300 bg-white text-transparent"
					}`}
					aria-label={isCompleted ? "Mark as incomplete" : "Mark as complete"}
				>
					✓
				</button>

				<div class="flex min-w-0 flex-1 flex-col">
					<h3
						class={`truncate text-sm ${
							isCompleted ? "text-gray-400 line-through" : "text-gray-800"
						}`}
					>
						{title}
					</h3>

					<div class="mt-0.5 flex items-center gap-2 text-[12px] text-gray-400">
						{due && <span>{`${format(due, "MM/dd/yyyy")}`}</span>}
						{startsAt && due && (
							<span>
								{format(startsAt, "hh:mm")} - {format(due, "hh:mm")}
							</span>
						)}
						{priority && (
							<span
								class={
									priority === "high"
										? "text-red-400"
										: priority === "medium"
											? "text-amber-400"
											: "text-emerald-400"
								}
							>
								{priority}
							</span>
						)}
						{isRecurring && (
							<span class=" tracking-wide text-[12px]">recurring</span>
						)}
					</div>
				</div>

				<Button
					variant="outline"
					aria-label="Delete todo"
					title="Delete todo"
					size={"icon"}
					class="h-6 w-6 p-1 text-slate-700/20 border-gray-200/70 shadow-none hover:border-red-500 hover:text-red-600 transition-colors"
					onClick={(e: ClickEvent<HTMLButtonElement>) => {
						e.stopPropagation();
						handleDeleteTodo();
					}}
				>
					<Close size={16} />
				</Button>
				<Button
					variant="outline"
					aria-label="Edit todo"
					title="Edit todo"
					size={"icon"}
					class="h-6 w-6 p-1 text-slate-700/20 border-gray-200/70 shadow-none hover:border-slate-500 hover:text-slate-600 transition-colors"
					onClick={(e: ClickEvent<HTMLButtonElement>) => {
						e.stopPropagation();
						handleEditTodo();
					}}
				>
					<SquarePen />
				</Button>
			</div>
		</div>
	);
}
