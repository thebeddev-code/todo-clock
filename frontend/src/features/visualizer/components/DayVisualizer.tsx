import { addHours, formatDate, set } from "date-fns";
import { DEGREES_PER_HOUR } from "../utils/constants";
import { Todo } from "~/lib/types";

import { calcClosestDistToClockHandle } from "../utils/distToClockHandle";
import { drawTodos, todosToDrawables } from "../utils/drawTodos";
import {
  calcDegreesFrom,
  getCurrentTimeInDegrees,
  snapToStep
} from "../utils/math";
import { Clock } from "./Clock";
import { ColorWheel } from "./ColorWheel";
import { ClockHandle } from "./ClockHandle";
import { degreesToDate } from "../utils/date";
import { Sunrise, Sun, Sunset, Moon, ChevronUp } from "lucide-solid";
import { Accessor, createEffect, createMemo, createSignal, Show } from "solid-js";
import { ClickEvent } from "~/lib/types";

const RADIUS = 170;
const MAX_LAST_CLICK_DIFF_MS = 300;
const VIEW_HOURS = 6;
// once it's reached we can set the date to next
const MAX_TOTAL_DEGREES = 360 * 2;

interface Props {
  todos: Todo[];
  onFormOpen?: (data: Pick<Todo, "startsAt" | "due">) => void;
  onMoveDate?: (days: number) => void;
  currentDate?: Accessor<Date>;
}

export function DayVisualizer({
  todos,
  onFormOpen,
  onMoveDate,
  currentDate,
}: Props) {
  const currentTimeInDegrees = getCurrentTimeInDegrees(currentDate?.());
  let canvasRef!: HTMLCanvasElement;
  let lastClickTimeRef: number = 0;
  const [clockHandleDegrees, setClockHandleDegrees] = createSignal({
    currentAngle: currentTimeInDegrees % 360,
    totalAngle: currentTimeInDegrees,
  });
  const [createTodoDegrees, setCreateTodoDegrees] = createSignal<{
    start: null | number;
    end: null | number;
  }>({
    start: null,
    end: null,
  });

  const newTodo = createMemo<Pick<Todo, "startsAt" | "due" | "color"> | null>(() => {
    const { start, end } = createTodoDegrees()
    if (!start || !end) return null
    return {
      startsAt: degreesToDate(start).toString(),
      due: degreesToDate(end).toString(),
      color: "#6F456E",
    }
  });
  createEffect(() => {
    const canvas = canvasRef;
    if (!canvas) {
      console.warn("Missing ref to clock canvas")
      return;
    };
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      console.log("Failed to get clock canvas context")
      return
    };
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    // Set internal resolution
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const viewHoursStart = clockHandleDegrees().totalAngle / DEGREES_PER_HOUR;
    const copyTodos = [...todos];
    if (newTodo()) copyTodos.push(newTodo() as Todo);
    const drawableTodos = todosToDrawables({ todos: copyTodos });
    drawTodos({
      canvas,
      drawableTodos: drawableTodos,
      radius: RADIUS,
      viewHours: {
        start: viewHoursStart - VIEW_HOURS,
        end: viewHoursStart + VIEW_HOURS,
      },
    });
  });

  function handleMoveDateClick(days: number) {
    const isMoveForward = days > 0;
    const offset = DEGREES_PER_HOUR / 60 * 5; // 5 min offset
    if (isMoveForward) {
      setClockHandleDegrees({
        currentAngle: offset,
        totalAngle: offset,
      });
      onMoveDate?.(1);
    }
    if (!isMoveForward) {
      setClockHandleDegrees({
        currentAngle: MAX_TOTAL_DEGREES % 360 - offset,
        totalAngle: MAX_TOTAL_DEGREES - offset,
      });
      onMoveDate?.(-1);
    }
  }

  function handleCreateTodoClick(e: ClickEvent<HTMLDivElement>) {
    // On the second double click we open the form and pass down the data
    if (
      typeof createTodoDegrees().start === "number" &&
      typeof createTodoDegrees().end === "number" &&
      newTodo()
    ) {
      const hours = (createTodoDegrees().end ?? 0) / DEGREES_PER_HOUR;
      const step = 15 / 60;
      // FIXME: doesn't take in calculation the currently set date 
      onFormOpen?.({
        startsAt: new Date(newTodo()?.startsAt as string).toISOString(),
        due: degreesToDate(
          calcDegreesFrom(snapToStep(hours, step), "hours"),
        ).toISOString(),
      });
      setCreateTodoDegrees({ start: null, end: null });
      return;
    }

    const lastClickTime = lastClickTimeRef;
    const currentClickTime = new Date().getTime();
    if (currentClickTime - lastClickTime < MAX_LAST_CLICK_DIFF_MS) {
      const offset = calcClosestDistToClockHandle({
        clickEvent: e,
        clockHandleDegrees: clockHandleDegrees().totalAngle,
      });
      const hours = (clockHandleDegrees().totalAngle + offset) / DEGREES_PER_HOUR;
      const step = 15 / 60; // 15 minutes
      setCreateTodoDegrees({
        start: calcDegreesFrom(snapToStep(hours, step), "hours"),
        end: null,
      });
    }
    lastClickTimeRef = currentClickTime;
  }

  const colorWheelDegrees = createMemo(() =>
    clockHandleDegrees().totalAngle > 360 * 2
      ? 0
      : clockHandleDegrees().totalAngle
  )

  return (
    <div class="select-none mt-20 bg-white flex-col flex justify-center items-center">
      <div class="relative rounded-full" onClick={handleCreateTodoClick}>

        {/* Date switching */}
        <div class="flex flex-row items-center gap-4 absolute -top-20 left-1/2 -translate-x-1/2">
          <button
            onClick={() => handleMoveDateClick(-1)}
            class="text-center h-5 w-5 rounded-full bg-muted text-xs font-medium text-muted-foreground select-none"
          >
            <ChevronUp class="-rotate-90" size={16} />
          </button>
          <div class="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground select-none">
            {formatDate(currentDate?.() ?? new Date(), "PP")}
          </div>
          <button
            onClick={() => handleMoveDateClick(1)}
            class="text-center h-5 w-5 rounded-full bg-muted text-xs font-medium text-muted-foreground select-none"
          >
            <ChevronUp class="rotate-90" size={16} />
          </button>
        </div>

        <ClockHandle
          value={clockHandleDegrees}
          onChange={(delta) => {
            const { totalAngle } = clockHandleDegrees();
            const newTotalAngle = totalAngle + delta;
            // Move to the next day
            if (newTotalAngle > MAX_TOTAL_DEGREES) {
              handleMoveDateClick(1);
              return;
            }
            // Move to the previous day
            if (newTotalAngle < 0) {
              handleMoveDateClick(-1);
              return;
            }
            setClockHandleDegrees(({ currentAngle, totalAngle }) => ({
              currentAngle: (currentAngle + delta) % 360,
              totalAngle: totalAngle + delta,
            }));
          }}
          resetValue={(v) => setClockHandleDegrees(v)}
          clockGraphRadius={RADIUS}
        >
          <Show when={typeof createTodoDegrees().start === "number"}>
            <ClockHandle
              value={createMemo(() => ({
                currentAngle:
                  createTodoDegrees().start as number,
                totalAngle: createTodoDegrees().start ?? 0,
              }))}
              clockGraphRadius={RADIUS}
              onChange={(_, total) => {
                if (!total) return
                if (!createTodoDegrees().start) return;
                // if (total < createTodoDegrees().start ?? 0) return;
                setCreateTodoDegrees(({ start }) => ({
                  start,
                  end: total,
                }));
              }}
              followMouse={true}
              variant="minimal"
              controlled={false}
            >
              <Clock ref={canvasRef} />
            </ClockHandle>
          </Show>
          <Show when={typeof createTodoDegrees().start !== "number"}>
            <Clock ref={canvasRef} />
          </Show>
        </ClockHandle>
        <ColorWheel
          degrees={
            // Normalizing degrees to avoid an edge case of unmatched value
            colorWheelDegrees
          }
          config={{
            // Night
            [180 * 1]: {
              color: "#191970",
              icon: (
                <Moon
                  class=" text-white bg-[#191970] rounded-full shadow-sm h-8 w-8 p-1"
                  style={{
                    "will-change": "transform",
                  }}
                />
              ),
            },
            // Morning
            [180 * 2]: {
              color: "#FFD700",
              icon: (
                <Sunrise
                  class="text-white border border-white  bg-linear-to-br bg-[#FFD700] rounded-full shadow-sm h-8 w-8 p-1"
                  size={20}
                  style={{
                    "will-change": "transform",
                  }}
                />
              ),
            },
            // Day
            [180 * 3]: {
              color: "#87CEEB",
              icon: (
                <Sun
                  class="text-amber-500 bg-white rounded-full shadow-sm h-8 w-8 p-1"
                  style={{
                    "will-change": "transform",
                  }}
                />
              ),
            },
            // Evening
            [180 * 4]: {
              color: "#FF7F50",
              icon: (
                <Sunset
                  class="text-white bg-linear-to-br from-[#FF7F50] to-[#87CEEB] rounded-full shadow-sm h-8 w-8 p-1"
                  size={20}
                  style={{
                    "will-change": "transform",
                  }}
                />
              ),
            },
          }}
        />
      </div>
    </div >
  );
}
