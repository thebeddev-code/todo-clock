import { getMouseAngleInDegrees } from "./math";

/**
 * Calculates the closest distance from the click point to the clock handler in degrees
 *
 * @param {Object} params - The parameters object.
 * @param {React.MouseEvent<HTMLDivElement>} params.clickEvent - The mouse click event.
 * @param {number} params.clockHandleDegrees - The current rotation of clock handle in degrees.
 * @returns {number} The closest distance from the click point to the clock handler in degrees
 * the result is negative if mouse pos in degrees is less than {params.clockHandleDegrees}
 */
export function calcClosestDistToClockHandle({
  clickEvent,
  clockHandleDegrees,
}: {
  clickEvent: MouseEvent & { currentTarget: HTMLDivElement };
  clockHandleDegrees: number;
}) {
  const normalizedCurrentTimeDegrees = clockHandleDegrees % 360;

  const mouseDegrees = getMouseAngleInDegrees(clickEvent);
  const clockwise = (mouseDegrees - normalizedCurrentTimeDegrees + 360) % 360;
  const counterclockwise =
    (normalizedCurrentTimeDegrees - mouseDegrees + 360) % 360;

  function isPastCurrentTimeAngle() {
    if (
      normalizedCurrentTimeDegrees < 360 &&
      (normalizedCurrentTimeDegrees + 180) % 360 < normalizedCurrentTimeDegrees
    ) {
      return (
        (normalizedCurrentTimeDegrees <= mouseDegrees && mouseDegrees <= 360) ||
        (mouseDegrees >= 0 &&
          mouseDegrees <= (normalizedCurrentTimeDegrees + 180) % 360)
      );
    }
    return (
      normalizedCurrentTimeDegrees <= mouseDegrees &&
      mouseDegrees <= normalizedCurrentTimeDegrees + 180
    );
  }
  const distDegrees = isPastCurrentTimeAngle() ? clockwise : -counterclockwise;
  return distDegrees;
}
