import { Sunrise, Sun, Sunset, Moon, RotateCcw } from "lucide-solid";
import { ClickEvent } from "~/lib/types";
import { cn } from "~/lib/utils";

interface Props {
  onQuickTimeSwitchClick: (args: {
    index?: number;
    event: ClickEvent<HTMLButtonElement>;
    resetClockHandle?: boolean;
  }) => void;
}
export function ClockHandleTools({ onQuickTimeSwitchClick }: Props) {
  const iconSize = 10;
  return (
    <div class="absolute">
      <div
        class="z-20 relative flex items-center justify-center w-28 h-28 mx-auto rounded-full"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          class={cn(
            `absolute 
                    w-8 h-8 flex items-center justify-center text-gray-500 hover:text-slate-500
                    bg-white/40 rounded-full border transition-colors duration-300`,
          )}
          onClick={(e) =>
            onQuickTimeSwitchClick({
              resetClockHandle: true,
              event: e,
            })
          }
          title="Reset clock"
        >
          <RotateCcw class="w-3 h-3" />
        </button>
        <button
          class="absolute translate-x-7 -translate-y-7 opacity-40 hover:opacity-100
                    w-8 h-8 flex items-center justify-center text-gray-500 hover:text-slate-500
                    bg-white/40 rounded-full border transition-colors duration-300"
          onClick={(e) =>
            onQuickTimeSwitchClick({
              index: 1,
              event: e,
            })
          }
          title="Morning"
        >
          <Sunrise class="w-3 h-3" />
        </button>

        <button
          class="absolute translate-7 opacity-40 hover:opacity-100
                    w-8 h-8 flex items-center justify-center text-gray-500 hover:text-yellow-500
                    bg-white/40 rounded-full border transition-colors duration-300"
          onClick={(e) =>
            onQuickTimeSwitchClick({
              index: 2,
              event: e,
            })
          }
          title="Day"
        >
          <Sun class="w-3 h-3" />
        </button>

        <button
          class="absolute -translate-x-7 translate-y-7 opacity-40 hover:opacity-100
                    w-8 h-8 flex items-center justify-center text-gray-500 hover:text-purple-500
                    bg-white/40 rounded-full border transition-colors duration-300"
          onClick={(e) =>
            onQuickTimeSwitchClick({
              index: 3,
              event: e,
            })
          }
          title="Evening"
        >
          <Sunset class="w-3 h-3" />
        </button>

        <button
          class="absolute -translate-7 opacity-40 hover:opacity-100
                    w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-800
                    bg-white/40 rounded-full border transition-colors duration-300"
          onClick={(e) =>
            onQuickTimeSwitchClick({
              index: 0,
              event: e,
            })
          }
          title="Night"
        >
          <Moon class="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
