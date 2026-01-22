import { createEffect, createMemo, createSignal, For, Show } from "solid-js";
import { CreateTodoPayload } from "~/lib/schemas/todo.schema";
import { createStore } from "solid-js/store";
import { TextField } from "@kobalte/core/text-field";
import { Checkbox } from "@kobalte/core/checkbox";
import { Select } from "@kobalte/core/select";
import { Separator } from "@kobalte/core/separator";
import { ColorSwatch } from "@kobalte/core/color-swatch";
import { ColorWheel } from "@kobalte/core/color-wheel";
import { format, formatDate, set } from "date-fns";
import { TagsField } from "~/lib/components/ui/form/tags-field";
import { Todo } from "~/lib/types";
import { DEFAULT_TAGS, WEEKDAYS } from "../lib/constants";


type FormData = CreateTodoPayload & {
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
    color: "black",
    due: new Date().toISOString(),
    startsAt: new Date().toString(),
    recurrenceRule: "",
    monthlyDate: new Date().toString()
  });

  const [formErrors, setFormErrors] = createStore<Partial<Todo>>();
  function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    console.log(formData);
  }
  type ValueType<Key extends keyof CreateTodoPayload> = CreateTodoPayload[Key];
  function createFieldChangeHandler<Key extends keyof CreateTodoPayload>(
    fieldName: keyof CreateTodoPayload,
  ) {
    return (value: CreateTodoPayload[Key]) =>
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

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Priority Select */}
        <Select
          options={["low", "medium", "high"]}
          value={formData.priority}
          onChange={createFieldChangeHandler("priority")}
          placeholder="Select priority"
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
          <Select.Label class="z-50 relative text-sm font-semibold text-slate-700 mb-1.5 block">
            Priority
          </Select.Label>
          <Select.Trigger
            aria-label="Priority"
            class="flex items-center justify-between w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
          >
            <Select.Value<string>>
              {(state) => state.selectedOption()}
            </Select.Value>
            <Select.Icon class="text-slate-400 text-xs">▼</Select.Icon>
          </Select.Trigger>
          <Select.Portal>
            <Select.Content class="z-50 relative bg-white border border-slate-200 rounded-lg shadow-xl p-1 animate-in fade-in zoom-in-95 duration-100">
              <Select.Listbox class="outline-none" />
            </Select.Content>
          </Select.Portal>
        </Select>

        {/* Status Select */}
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

        <Separator class="md:col-span-2 h-px bg-slate-200 my-2" />
        {/* Color Picker (Using TextField input type color) */}
        <TextField class="flex flex-col gap-1">
          <TextField.Label class="text-sm font-medium text-slate-700">
            Category Color
          </TextField.Label>
          <TextField.Input
            type="color"
            class="h-10 w-full rounded-md border border-slate-300 bg-transparent p-1 cursor-pointer"
          />
        </TextField>
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
