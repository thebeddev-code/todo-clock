import { createEffect, createMemo, createSignal, For, Show } from "solid-js";
import { CreateTodoPayload } from "~/lib/schemas/todo.schema";
import { createStore } from "solid-js/store";
import { TextField } from "@kobalte/core/text-field";
import { Select } from "@kobalte/core/select";
import { ColorSwatch } from "@kobalte/core/color-swatch";
import { format, formatDate, parse, set } from "date-fns";
import { TagsField } from "~/lib/components/ui/form/tags-field";
import { Todo } from "~/lib/types";
import { DEFAULT_TAGS, WEEKDAYS } from "../lib/constants";
import { Color, parseColor } from "@kobalte/core/colors";
import { ColorSlider } from "@kobalte/core/color-slider";



/*
 * TODO: Sync starts at and due fields when setting starts at field
 * DONE: Better color input
 * TODO: Form errors
 *
 * */

type FormData = Omit<CreateTodoPayload, "color"> & {
  color: Color,
  monthlyDate: string
}

export function TodoForm() {
  const [formData, setFormData] = createStore<FormData>({
    title: "",
    isRecurring: false,
    tags: [],
    createdAt: new Date().toISOString(),
    description: "",
    priority: "low",
    status: "pending",
    updatedAt: new Date().toISOString(),
    color: parseColor("hsl(80, 100%, 50%)"),
    due: new Date().toISOString(),
    startsAt: new Date().toString(),
    recurrenceRule: "",
    monthlyDate: new Date().toString()
  });

  const [formErrors, setFormErrors] = createStore<Partial<Todo>>({});
  const [formTouchedFields, setFormTouchedFields] = createStore<Partial<Record<keyof Todo, boolean>>>({});

  function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    console.log(formData);
  }
  // TODO: Replace with FormData type
  function createFieldChangeHandler<Key extends keyof FormData>(
    fieldName: keyof FormData
  ) {
    return (value: FormData[Key]) =>
      setFormData((data) => ({
        ...data,
        [fieldName]: value,
      }));
  }
  function createTimeFieldChangeHandler(fieldName: "startsAt" | "due") {
    return (t: string) => {
      const [h, m] = t.split(":");

      setFormData((data) => ({
        ...data,
        [fieldName]: set(data.startsAt as string, {
          hours: Number.parseInt(h) as number,
          minutes: Number.parseFloat(m) as number,
        }),
      }));
    };
  }

  const tagSuggestions = createMemo(() => {
    const tags = formData.tags.map((t) => t.toLowerCase().trim());
    if (tags.includes("everyday") || tags.includes("monthly")) return []
    if (WEEKDAYS.find((w) => tags.includes(w))) return WEEKDAYS.filter((w) => !tags.includes(w));
    return DEFAULT_TAGS;
  })

  createEffect(() => {
    const currentMonthly = new Date(formData.monthlyDate);
    function getRecurrenceRule(tags: string[]) {
      const lowerCaseTags: string[] = tags.map((v: string) =>
        v.toLowerCase(),
      );
      if (lowerCaseTags.includes("everyday")) return "everyday";
      const weekly = lowerCaseTags.filter((v) => WEEKDAYS.includes(v));
      if (weekly.length > 0) return `weekly=${weekly.join(",")}`;
      if (lowerCaseTags.includes("weekly"))
        return `weekly=${WEEKDAYS[new Date().getDay() - 1]}`;
      if (lowerCaseTags.includes("monthly")) {
        const monthlyDate = formatDate(
          currentMonthly ? new Date(currentMonthly) : new Date(),
          "yyyy-MM-dd",
        );
        return `monthly=${monthlyDate}`;
      }

      return "";
    }
    const prefix = "rrule:"
    const recurrenceRule = `${prefix}${getRecurrenceRule(formData.tags)}`.toLowerCase();
    console.log(recurrenceRule)
    setFormData((data) => ({ ...data, recurrenceRule, isRecurring: recurrenceRule !== prefix }))
  })

  return (
    <form
      autocomplete="off"
      onSubmit={handleSubmit}
      class="flex flex-col gap-6 bg-white p-8 rounded-xl shadow-sm border border-slate-200 w-1/2 mx-auto"
    >
      <header>
        <h2 class="text-xl font-bold text-slate-800">Create New Task</h2>
        <p class="text-sm text-slate-500">
          Fill out the details below to organize your todo.
        </p>
      </header>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Title - Full Width */}
        <TextField
          class="flex flex-col gap-1 md:col-span-2"
          value={formData.title}
          onChange={createFieldChangeHandler("title")}
        >
          <TextField.Label class="text-sm font-medium text-slate-700">
            Title
          </TextField.Label>
          <TextField.Input
            placeholder="What needs to be done?"
            class="px-3 py-2 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </TextField>

        {/* Description - Full Width */}
        <TextField
          class="flex flex-col gap-1 md:col-span-2"
          value={formData.description}
          onChange={createFieldChangeHandler("description")}
        >
          <TextField.Label class="text-sm font-medium text-slate-700">
            Description
          </TextField.Label>
          <TextField.TextArea
            placeholder="Add some details..."
            class="px-3 py-2 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
          />
        </TextField>
      </div>

      <div class="grid grid-cols-2 gap-4">
        {/* Start Date */}
        <TextField
          class=" flex flex-col gap-1"
          value={format(formData.startsAt as string, "HH:mm", {})}
          onChange={createTimeFieldChangeHandler("startsAt")}
        >
          <TextField.Label class="text-sm font-medium text-slate-700">
            Starts At
          </TextField.Label>
          <TextField.Input
            type="time"
            class="px-3 py-2 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </TextField>

        {/* Due Date */}
        <TextField
          class="flex flex-col gap-1"
          value={format(formData.due as string, "HH:mm", {})}
          onChange={createTimeFieldChangeHandler("due")}
        >
          <TextField.Label class="text-sm font-medium text-slate-700">
            Starts At
          </TextField.Label>
          <TextField.Input
            type="time"
            class="px-3 py-2 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </TextField>
      </div>

      {/* TODO: Render on todo update  */}
      <Show when={false}>
        <Select
          options={["pending", "in-progress", "completed"]}
          value={formData.status}
          placeholder="Select status"
          itemComponent={(props) => (
            <Select.Item
              item={props.item}
              class="flex items-center justify-between px-3 py-2 text-sm text-slate-700 cursor-pointer rounded-md outline-none focus:bg-indigo-50 focus:text-indigo-700"
            >
              <Select.ItemLabel>{props.item.rawValue}</Select.ItemLabel>
              <Select.ItemIndicator>
                <span class="text-indigo-600">✓</span>
              </Select.ItemIndicator>
            </Select.Item>
          )}
        >
          <Select.Label class="text-sm font-semibold text-slate-700 mb-1.5 block">
            Status
          </Select.Label>
          <Select.Trigger class="flex items-center justify-between w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all">
            <Select.Value class="text-sm">
              {/* {state => state.selectedOption()} */}
            </Select.Value>
            <Select.Icon class="text-slate-400 text-xs">▼</Select.Icon>
          </Select.Trigger>
          <Select.Portal>
            <Select.Content class="bg-white border border-slate-200 rounded-lg shadow-xl p-1">
              <Select.Listbox class="outline-none" />
            </Select.Content>
          </Select.Portal>
        </Select>
      </Show>


      <div class="flex flex-wrap items-start gap-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
        {/* Priority Select */}
        <div class="flex-1 min-w-50">
          <Select
            options={["low", "medium", "high"]}
            value={formData.priority}
            onChange={createFieldChangeHandler("priority")}
            placeholder="Select priority"
            itemComponent={(props) => (
              <Select.Item
                item={props.item}
                class="flex items-center justify-between px-3 py-2 text-sm text-slate-700 
                rounded-md cursor-pointer hover:bg-indigo-50 focus:bg-indigo-100 outline-none"
              >
                <Select.ItemLabel class="first-letter:uppercase">
                  {props.item.rawValue}
                </Select.ItemLabel>
                <Select.ItemIndicator>
                  <span class="text-indigo-600">✓</span>
                </Select.ItemIndicator>
              </Select.Item>
            )}
          >
            <Select.Label class="block text-sm font-semibold text-slate-800 mb-2">
              Priority
            </Select.Label>
            <Select.Trigger
              aria-label="Priority"
              class=" flex items-center justify-between w-full px-3 py-2 bg-white border 
              border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
              outline-none transition-all"
            >
              <Select.Value<string> class="first-letter:uppercase">
                {(state) => state.selectedOption() || "Select priority"}
              </Select.Value>
              <Select.Icon class="text-slate-400">▼</Select.Icon>
            </Select.Trigger>
            <Select.Portal>
              <Select.Content class="z-50 bg-white border border-slate-200 rounded-lg shadow-lg p-1 animate-in fade-in zoom-in-95 duration-150">
                <Select.Listbox class="outline-none" />
              </Select.Content>
            </Select.Portal>
          </Select>
        </div>

        {/* Color Picker */}
        <div class="flex-1 min-w-62.5">
          <ColorSlider
            defaultValue={formData.color}
            value={formData.color}
            channel="hue"
            onChange={createFieldChangeHandler("color")}
          >
            <div class="flex items-center justify-between mb-2">
              <ColorSlider.Label class="text-sm font-semibold text-slate-800">
                Color
              </ColorSlider.Label>
              <ColorSlider.ValueLabel class="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded" />
            </div>
            <div class="flex items-center gap-3">
              <ColorSwatch
                class="w-10 h-10 rounded-md border border-slate-600/50"
                value={formData.color}
              />
              <ColorSlider.Track class="relative flex-1 h-2 bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500 rounded-full shadow-inner cursor-pointer">
                <ColorSlider.Thumb class="block w-4 h-4 -mt-1 bg-white border-2 border-slate-400 rounded-full shadow focus:outline-none focus:ring-2 focus:ring-indigo-400">
                  <ColorSlider.Input />
                </ColorSlider.Thumb>
              </ColorSlider.Track>
            </div>
          </ColorSlider>
        </div>
      </div>

      {/* Tags */}
      <TagsField
        value={formData.tags}
        onChange={createFieldChangeHandler("tags")}
        label="Tags"
        suggestions={tagSuggestions()}
        error={createMemo(() => formErrors.tags?.[0] ?? "")()}
      />

      <Show when={formData.recurrenceRule?.includes("monthly")}>
        <TextField
          class="flex flex-col gap-1 md:col-span-2"
          value={formData.monthlyDate}
          onChange={createFieldChangeHandler("monthlyDate")}
        >
          <TextField.Label class="text-sm font-medium text-slate-700">
            Monthly date
          </TextField.Label>
          <TextField.Input
            type="date"
            placeholder="Monthly date"
            class="px-3 py-2 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </TextField>
      </Show>

      <button
        type="submit"
        class="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-colors shadow-sm active:scale-[0.98]"
      >
        Create Task
      </button>
    </form>
  );
}
