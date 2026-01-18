import { differenceInCalendarDays } from "date-fns";

import type { DrawableTodo } from "./types.d.ts"
import type { Todo } from "~/lib/types/api.js";
import { calcDegreesFrom, calcRadiansFrom } from "./math";

export function todosToDrawables({
  todos,
  now = new Date(),
}: {
  todos: Todo[];
  now?: Date;
}): DrawableTodo[] {
  return todos
    .filter((t) => t.startsAt && t.due)
    .map((t) => {
      const startsAt = new Date(t.startsAt as string);
      const endsAt = new Date(t.due as string);

      // Converting the time to hour
      // Since 1 hours is 60 minutes, we divide by 60
      // Same for seconds
      let todoStartTime =
        startsAt.getHours() +
        startsAt.getMinutes() / 60 +
        startsAt.getSeconds() / 3600;
      todoStartTime += 24 * differenceInCalendarDays(startsAt, now);

      let todoEndTime =
        endsAt.getHours() +
        endsAt.getMinutes() / 60 +
        endsAt.getSeconds() / 3600;
      // In todo spans today and the next day
      todoEndTime += 24 * differenceInCalendarDays(endsAt, now);

      return {
        startTimeHours: todoStartTime,
        endTimeHours: todoEndTime,
        color: t.color ?? "black",
      };
    });
}

interface DrawTodos {
  canvas: HTMLCanvasElement;
  drawableTodos: DrawableTodo[];
  x?: number;
  y?: number;
  radius?: number;
  viewHours: {
    start: number;
    end: number;
  };
}

export function drawTodos({
  canvas,
  drawableTodos,
  x,
  y,
  radius,
  viewHours,
}: DrawTodos) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const rect = canvas.getBoundingClientRect();

  const drawTodo = (
    drawRadiansStart: number,
    drawRadiansEnd: number,
    offset: number,
    color: string,
  ) => {
    if (!ctx) return;
    ctx.beginPath();
    ctx.arc(
      x ?? rect.width / 2,
      y ?? rect.height / 2,
      radius ?? 200,
      drawRadiansStart - offset,
      drawRadiansEnd - offset,
    );
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 40;
    ctx.stroke();
  };

  for (const { startTimeHours, endTimeHours, color } of drawableTodos) {
    const drawDegreesStart = calcDegreesFrom(
      Math.max(startTimeHours, viewHours.start),
      "hours",
    );
    const drawDegreesEnd = calcDegreesFrom(
      Math.min(endTimeHours, viewHours.end),
      "hours",
    );

    const drawRadiansStart = calcRadiansFrom(drawDegreesStart);
    const drawRadiansEnd = calcRadiansFrom(drawDegreesEnd);
    if (viewHours.start <= endTimeHours && viewHours.end >= startTimeHours)
      drawTodo(
        drawRadiansStart,
        drawRadiansEnd,
        calcRadiansFrom(90),
        color ?? "magenta",
      );
  }
}
