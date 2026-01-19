import { addHours, formatDate, set } from "date-fns";

import { DEGREES_PER_HOUR } from "../utils/constants";
import { cn } from "~/lib/utils";
import {
  getCurrentTimeInDegrees,
  getMouseAngleInDegrees,
} from "../utils/math";

import { ClockHandleTools } from "./ClockHandleTools";
import { ClickEvent } from "~/lib/types";
import { Accessor, createEffect, createMemo, createSignal, JSXElement } from "solid-js";

const HANDLE_BUTTON_SIZE_PX = 21;


export type AngleValue = {
  currentAngle: number;
  totalAngle: number;
};

interface Props {
  containerClassName?: string,
  children?: JSXElement;
  clockGraphRadius: number;
  value: Accessor<AngleValue>;
  resetValue?: (v: AngleValue) => void;
  // TODO: rewrite to accept an object instead
  onChange: (delta: number, total?: number) => void;
  variant?: "minimal" | "full";
  followMouse?: boolean;
  shouldUpdateTime?: boolean;
  controlled?: boolean
}

export function ClockHandle({
  children,
  containerClassName = "",
  clockGraphRadius,
  value,
  onChange,
  followMouse = false,
  variant = "full",
  resetValue,
  controlled = true
}: Props) {
  const [handleDegrees, setHandleDegrees] = createSignal({
    mouse: value().totalAngle % 360,
    total: value().totalAngle,
  })
  const [mouseDown, setMouseDown] = createSignal(followMouse);
  const [mouseEnter, setMouseEnter] = createSignal(followMouse);
  const time = createMemo(() => {
    const t = controlled ? value().totalAngle : handleDegrees().total;
    return formatDate(
      addHours(
        set(new Date(), { hours: 0, minutes: 0, seconds: 0 }),
        t / DEGREES_PER_HOUR,
      ),
      "p",
    )
  });
  const showTooltip = true;
  // Handle resetting the last raw angle after clock handle reset

  let lastRawAngle: number | null = null;
  const handleMouseMove = (e: ClickEvent<HTMLDivElement>) => {
    if (!mouseDown()) return;

    const mouseDegrees = getMouseAngleInDegrees(e);
    if (lastRawAngle == null) {
      lastRawAngle = mouseDegrees;
      return;
    }

    let delta = mouseDegrees - lastRawAngle;
    //Fix wrap at 0/360
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;

    lastRawAngle = mouseDegrees;

    const newTotal = handleDegrees().total + delta;
    if (!controlled) {
      setHandleDegrees({
        mouse: mouseDegrees,
        total: newTotal,
      })
    }
    onChange?.(delta, newTotal);
  }
    ;
  let hasUsedQuickSwitch = false;
  createEffect(() => {
    const intervalId = setInterval(() => {
      if (mouseDown() || hasUsedQuickSwitch) return;
      onChange(DEGREES_PER_HOUR / 3600);
    }, 1000);
    return () => clearInterval(intervalId);
  });
  function handleQuickTimeSwitchClick({
    index = 1,
    event,
    resetClockHandle,
  }: {
    index?: number;
    event: ClickEvent<HTMLButtonElement>;
    resetClockHandle?: boolean;
  }) {
    event.stopPropagation();
    if (resetClockHandle) {
      const currentTimeDegrees = getCurrentTimeInDegrees();
      resetValue?.({
        currentAngle: currentTimeDegrees % 360,
        totalAngle: currentTimeDegrees,
      });
      // Resetting the last raw angle, very important
      lastRawAngle = null;
      hasUsedQuickSwitch = false;
      return;
    }
    // So, we know that conversion rate of degrees to hours is 30 degrees because {360 / 12 = 30}
    const angle = 180 * index;

    // Small offset to correctly calculate part of the day
    const offset = DEGREES_PER_HOUR * (1 / 60 / 60);
    resetValue?.({
      currentAngle: angle % 360,
      totalAngle: angle + offset,
    });

    // Do not increase the clock handle angle with time passage
    hasUsedQuickSwitch = true;
  }

  const displayAngle = () => controlled ? value().currentAngle : handleDegrees().total;
  const clockHandleStyles = createMemo(() => ({
    transform: `rotate(${displayAngle() + 90}deg)`,
    "transform-origin": "50% 50%",
    width: `${clockGraphRadius * 2 + HANDLE_BUTTON_SIZE_PX}px`,
  }));

  return (
    <div
      class={cn(
        "relative flex justify-center items-center",
        containerClassName,
      )}
      onMouseUp={() => {
        if (!followMouse) setMouseDown(false);
      }}
      onMouseLeave={() => {
        if (!followMouse) setMouseDown(false);
      }}
      onMouseMove={handleMouseMove}
    >
      <div
        style={clockHandleStyles()}
        class={cn("z-10 absolute flex justify-start items-center")}
      >
        <div
          onMouseDown={() => setMouseDown(true)}
          onMouseEnter={() => setMouseEnter(true)}
          onMouseLeave={() => setMouseEnter(false)}
          style={{
            width: `${HANDLE_BUTTON_SIZE_PX}px`,
            height: `${HANDLE_BUTTON_SIZE_PX}px`,
          }}
          class={cn(
            "absolute flex justify-center items-center bg-slate-800/20 rounded-full  -left-2.75",
            {
              "cursor-grab": variant === "full",
            },
          )}
        >
          <div
            class={cn({
              "relative bg-slate-800 h-1 w-1 rounded-full": variant === "full",
            })}
          >
            {/* <AnimatePresence> */}
            {showTooltip && (
              <div
                // initial={{ opacity: 0, y: 4, scale: 0.95 }}
                // animate={{ opacity: 1, y: 0, scale: 1 }}
                // exit={{ opacity: 0, y: 4, scale: 0.95 }}
                // transition={{ type: "spring", stiffness: 260, damping: 20 }}
                class="absolute -translate-x-20 select-none
                     bg-muted px-3 py-1 rounded-full "
                style={{
                  rotate: `-${Math.round(displayAngle() + 90)}deg`,
                  "transform-origin": "center center",
                }}
              >
                <span class="whitespace-nowrap text-xs text-muted-foreground font-medium">
                  {time()}
                </span>
              </div>
            )}
            {/* </AnimatePresence> */}
          </div>
        </div>
        <div
          class={cn("border-slate-800/40 border h-[50%] w-[50%]", {
            "border-dotted w-full": variant === "full",
          })}
        />
        {/* <div class="bg-slate-900 h-2 w-2 rounded-full cursor-grab" /> */}
      </div>
      {children}
      {variant === "full" && <ClockHandleTools onQuickTimeSwitchClick={handleQuickTimeSwitchClick} />}
    </div>
  );
}

