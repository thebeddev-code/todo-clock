import { DEGREES_PER_HOUR } from "./constants";
import { addHours, set } from "date-fns";

export function degreesToDate(degrees: number, startDate = new Date()) {
  return addHours(
    set(startDate, { hours: 0, minutes: 0, seconds: 0 }),
    degrees / DEGREES_PER_HOUR,
  );
}
