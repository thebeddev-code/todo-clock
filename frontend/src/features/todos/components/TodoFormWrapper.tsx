import { Show } from "solid-js"
import { setTodoFormStore, todoFormStore } from "./todoFormStore"
import { TodoForm } from "./TodoForm"
import { cn } from "~/lib/utils/cn"


export function TodoFormWrapper() {
  return (
    <div
      onClick={() => setTodoFormStore((s) => ({ ...s, formType: null }))}
      class={cn(
        "right-0 min-w-dvw min-h-dvh fixed z-50 bg-black/10 backdrop-blur-sm transition-transform duration-500 ease-in-out",
        {
          "translate-x-0": todoFormStore.formType, // Slide in (visible)
          "translate-x-full": !todoFormStore.formType, // Slide out (off-screen right)
        }
      )}
    >
      {/* Content container aligned to the right */}
      <div
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
        class="relative left-1/2 w-1/2 bg-white dark:bg-gray-900 "
      >
        <Show when={Boolean(todoFormStore.formType)}>
          <TodoForm />
        </Show>
      </div>
    </div>
  );
}
