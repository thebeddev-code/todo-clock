import { Todo } from "~/lib/types";

export type VisualizableTodo = Pick<Todo, "startsAt" | "due" | "color">

export type DrawableTodo = {
  startTimeHours: number;
  endTimeHours: number;
  color: string;
};
