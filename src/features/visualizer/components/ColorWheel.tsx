import { Accessor, createEffect, createMemo, JSX } from "solid-js";
import { COLOR_WHEEL_WIDTH } from "../utils/constants";

interface Props {
  degrees: Accessor<number>;
  config: Record<
    string,
    {
      color: string;
      icon: string | JSX.Element;
    }
  >;
}

export function ColorWheel({ config, degrees: currentDegrees }: Props) {
  let canvasRef!: HTMLCanvasElement;

  createEffect(() => {
    if (!canvasRef)
      return
    const canvas = canvasRef as unknown as HTMLCanvasElement;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    // ctx.scale(dpr, dpr);

    const drawArc = (
      degreesStart: number,
      degreesEnd: number,
      offset: number,
      color: string,
      opacity: number = 0.9,
    ) => {
      if (!ctx) return;

      const toRad = (deg: number) => (deg * Math.PI) / 180;
      const startAngle = toRad(degreesStart - offset);
      const endAngle = toRad(degreesEnd - offset);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = Math.min(centerX, centerY) * 0.8;

      ctx.globalAlpha = opacity;
      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, startAngle, endAngle, false);
      ctx.lineWidth = COLOR_WHEEL_WIDTH;
      ctx.strokeStyle = color;
      ctx.stroke();
      ctx.restore();
    };

    const marks = Object.entries(config).sort(([d1Str], [d2Str]) => {
      const d1 = Number.parseFloat(d1Str) as number;
      const d2 = Number.parseFloat(d2Str) as number;
      if (!Number.isFinite(d1) || !Number.isFinite(d2)) return -1;
      return d1 - d2;
    });
    // opacity for the past 6 hours time window
    // Think of this as a multicolor line segment, with start and end degrees
    for (let i = 0; i < marks.length; ++i) {
      // this is the end
      let [degreesEndString, { color }] = marks[i];
      let degreesEnd = Number.parseFloat(degreesEndString);
      if (!Number.isFinite(degreesEnd)) continue;
      //  this is the start
      let degreesStart = degreesEnd - 180;
      if (degreesStart <= currentDegrees() && currentDegrees() <= degreesEnd) {
        degreesStart = degreesStart % 360;
        degreesEnd = degreesEnd % 360;
        if (degreesEnd === 0) degreesEnd += 360;

        // the left half side (before the clock handle)
        drawArc(degreesStart, currentDegrees(), 90, color);
        // the right half side (after the clock handle)
        drawArc(currentDegrees(), degreesEnd, 90, color);

        // The other halfs ... think of this as multicolor line segment
        // the left half side (before the clock handle)
        drawArc(
          currentDegrees() - 180,
          degreesStart,
          90,
          marks[i - 1]?.[1].color ?? marks.at(-1)?.[1].color,
        );
        // the right half side (after the clock handle)
        drawArc(
          degreesEnd,
          (currentDegrees() + 180) % 360,
          90,
          marks[(i + 1) % marks.length]?.[1].color ?? "cyan",
        );
        // Very important
        return;
      }
    }
  });


  const icon = createMemo(() => {
    const current = currentDegrees();
    const match = Object.entries(config).find(([degrees]) => {
      const d = Number.parseFloat(degrees);
      return Number.isFinite(d) && d - 180 <= current && current <= d;
    });
    return match?.[1].icon ?? "🙂";
  });

  return (
    <div class="left-0 top-0 translate-1/2 absolute h-50 w-50 rounded-full">
      <canvas ref={canvasRef} class="w-full h-full rounded-full" />
      <div class="flex justify-center items-center left-0 top-0 absolute w-full h-full rounded-full">
        <div
          style={{
            transform: `rotate(${(currentDegrees() % 360) + 180}deg) translateY(80px)`,
          }}
        >
          <div
            class="select-none rounded-full shadow-md flex justify-center items-center"
            style={{
              transform: `rotate(${-((currentDegrees() % 360) + 180)}deg)`,
            }}
          >
            {icon()}
          </div>
        </div>
      </div>
    </div>
  );
}
