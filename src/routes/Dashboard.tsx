import { DayVisualizer } from "~/features/visualizer/components/DayVisualizer";
// import { useTodoForm } from "@/features/todos/stores/todoForm.store";
// import { TodoFormWrapper } from "@/features/todos/TodoFormWrapper";
// import { TodoList } from "@/features/todos/TodoList";
import { addDays, set } from "date-fns";
import { Accessor, createSignal, Show } from "solid-js";
import { Todo } from "~/lib/types";
import { createAsync } from "@solidjs/router";
import { getTodos } from "~/features/todos/api/getTodos";
import { TodoList } from "~/features/todos/components/TodoList";
import { TodoForm } from "~/features/todos/components/TodoForm";

export default function Dashboard() {
  const todos = createAsync(() => getTodos()) as Accessor<Todo[]>;
  const [currentDate, setCurrentDate] = createSignal(new Date());
  // const { data, status } = useTodos({
  //   params: {
  //     due: "today",
  //   },
  // });
  // const changeFormType = useTodoForm((state) => state.changeFormType);
  return (
    <div class="flex">
      <div class="w-50 h-dvh">Kinda sidebar</div>
      <main class="flex-1 h-dvh grid grid-cols-2">
        {/* {status === "success" && todos && ( */}
        <Show when={todos()}>
          <DayVisualizer
            todos={todos() as Todo[]}
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
          />
          <TodoList todos={todos} />
        </Show>

        {/* )} */}
        {/* {status === "success" && todos && <TodoList todos={todos} />} */}
        {/* <TodoFormWrapper /> */}
        <div class="flex w-dvw absolute z-50 right-0">
          <TodoForm></TodoForm>
        </div>
      </main>
    </div>
  );
}
