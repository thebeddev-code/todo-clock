import { DayVisualizer } from "~/features/visualizer/components/DayVisualizer";
// import { useTodoForm } from "@/features/todos/stores/todoForm.store";
// import { TodoFormWrapper } from "@/features/todos/TodoFormWrapper";
// import { TodoList } from "@/features/todos/TodoList";
import { addDays, set } from "date-fns";
import { createSignal, Show } from "solid-js";
import { Todo } from "~/lib/types";
import { createAsync } from "@solidjs/router";
import { getTodos } from "~/features/todos/api/getTodos";

export default function Dashboard() {
  const todos = createAsync(() => getTodos())
  const [currentDate, setCurrentDate] = createSignal(new Date());
  // const { data, status } = useTodos({
  //   params: {
  //     due: "today",
  //   },
  // });
  // const changeFormType = useTodoForm((state) => state.changeFormType);
  return (
    <main class="flex justify-center items-center h-dvh flex-1 _grid _grid-cols-2">
      {/* {status === "success" && todos && ( */}
      <Show when={todos()}>
        <DayVisualizer
          todos={todos() as Todo[]}
          currentDate={currentDate()}
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

      </Show>

      <div></div>
      {/* )} */}
      {/* {status === "success" && todos && <TodoList todos={todos} />} */}
      {/* <TodoFormWrapper /> */}
    </main>
  );
}
