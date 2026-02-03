import {
	createEffect,
	createMemo,
	createSignal,
	For,
	Show,
	Switch,
} from "solid-js";
import {
	type CreateTodoPayload,
	todoPayloadSchema,
} from "~/lib/schemas/todo.schema";
import { createStore, unwrap } from "solid-js/store";
import { TextField } from "@kobalte/core/text-field";
import { Select } from "@kobalte/core/select";
import { ColorSwatch } from "@kobalte/core/color-swatch";
import { format, formatDate, parse, set } from "date-fns";
import { TagsField } from "~/lib/components/ui/form/tags-field";
import type { BlurEvent, Todo } from "~/lib/types";
import { DEFAULT_TAGS, WEEKDAYS } from "../lib/constants";
import { Color, parseColor } from "@kobalte/core/colors";
import { trackDeep, trackStore } from "@solid-primitives/deep";
import { trimAndLowercase } from "~/lib/utils/strings";
import { createTodo } from "../api/createTodo";
import {
	closeTodoForm,
	setTodoFormStore,
	todoFormStore,
} from "./todoFormStore";
import { updateTodoMutation } from "../api/updateTodoMutation";
import z from "zod";

/*
 * TODO: Sync starts at and due fields when setting starts at field
 * DONE: Better color input
 * TODO: Form validation
 *
 * */

type FormData = CreateTodoPayload & {
	monthlyDate: string;
};

// NOTE: Not the best form and a lot can be improved but it gets the job done
export function TodoForm() {
	const [formData, setFormData] = createStore<FormData>(
		todoFormStore.todoData as FormData,
	);
	const [formErrors, setFormErrors] = createStore<Partial<Todo>>({});
	const [formTouched, setFormTouched] = createStore<
		Partial<Record<keyof Todo, boolean>>
	>({});

	function createFieldChangeHandler<Key extends keyof FormData>(
		fieldName: keyof FormData,
	) {
		return (value: FormData[Key]) =>
			setFormData((data) => ({
				...data,
				[fieldName]: value,
			}));
	}

	function handleBlur(e: BlurEvent) {
		const { name } = e.target;
		setFormTouched((prev) => ({ ...prev, [name]: true }));
	}

	function createTimeFieldChangeHandler(fieldName: "startsAt" | "due") {
		return (t: string) => {
			const [h, m] = t.split(":");
			setFormData((data) => ({
				...data,
				[fieldName]: set(data.startsAt as string, {
					hours: Number.parseInt(h) as number,
					minutes: Number.parseFloat(m) as number,
				}).toISOString(),
			}));
		};
	}

	const tagSuggestions = createMemo(() => {
		const tags = formData.tags.map((t) => t.toLowerCase().trim());
		// If recurrence [everyday] or [monthly] tag exist
		// We do not want to suggest [weekdays] tags
		// Since recurrence can't be both [everyday] and [weekday]
		if (tags.includes("everyday") || tags.includes("monthly")) return [];
		// Same logic applies to here
		if (WEEKDAYS.find((w) => tags.includes(w)))
			return WEEKDAYS.filter((w) => !tags.includes(w));

		return DEFAULT_TAGS;
	});

	// construct [recurrenceRule] from [tags] and set the [isRecurring] flag
	createEffect(() => {
		const currentMonthly = new Date(formData.monthlyDate);
		function getRecurrenceRule(tags: string[]) {
			const lowerCaseTags: string[] = tags.map((t: string) =>
				trimAndLowercase(t),
			);

			if (lowerCaseTags.includes("everyday")) return "everyday";

			const weekly = lowerCaseTags.filter((t) => WEEKDAYS.includes(t));
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
		const prefix = "rrule:";
		const recurrenceRule =
			`${prefix}${getRecurrenceRule(formData.tags)}`.toLowerCase();
		setFormData((data) => ({
			...data,
			recurrenceRule,
			isRecurring: recurrenceRule !== prefix,
		}));
	});

	// NOTE: Probably a much better way to do this
	const getFormData = () => trackDeep(formData);
	const getFormTouched = () => trackDeep(formTouched);

	// Form Validation
	createEffect(() => {
		const formData = unwrap(getFormData());
		const formTouched = unwrap(getFormTouched());

		const { error } = todoPayloadSchema.safeParse(formData);
		const formErrorMessages: Record<string, string> = {};
		// Only process fields that have been touched
		const fields = Object.keys(formTouched);
		for (const f of fields) {
			const { message = null } =
				error?.issues.find((issue) => {
					return issue.path.includes(f);
				}) ?? {};
			formErrorMessages[f] = message ?? "";
		}
		setFormErrors(formErrorMessages);
	});

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();

		const data = unwrap(formData);
		const { success, error } = todoPayloadSchema.safeParse(data);
		if (!success) {
			return;
		}

		try {
			if (todoFormStore.formType === "create") {
				await createTodo({
					body: data as unknown as Todo,
				});
			}
			if (todoFormStore.formType === "update") {
				z.number().parse(todoFormStore.todoData?.id!);
				await updateTodoMutation({
					id: todoFormStore.todoData?.id as number,
					body: data as unknown as Todo,
				});
			}
		} catch (err) {
			console.error(err);
		} finally {
			closeTodoForm();
		}
	}

	return (
		<form
			autocomplete="off"
			onSubmit={handleSubmit}
			class="flex flex-col gap-6 bg-white p-8 mx-auto"
			onClick={(e) => e.stopPropagation()}
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
					name="title"
					class="flex flex-col gap-1 md:col-span-2"
					value={formData.title}
					onChange={createFieldChangeHandler("title")}
					validationState={formErrors.title ? "invalid" : "valid"}
				>
					<TextField.Label class="text-sm font-medium text-slate-700">
						Title
					</TextField.Label>
					<TextField.Input
						onBlur={handleBlur}
						placeholder="What needs to be done?"
						class="px-3 py-2 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
					/>
					<TextField.ErrorMessage class="text-sm text-red-400 mt-1">
						{formErrors.title}
					</TextField.ErrorMessage>
				</TextField>

				{/* Description - Full Width */}
				<TextField
					name="description"
					class="flex flex-col gap-1 md:col-span-2"
					value={formData.description}
					onChange={createFieldChangeHandler("description")}
				>
					<TextField.Label class="text-sm font-medium text-slate-700">
						Description
					</TextField.Label>
					<TextField.TextArea
						onBlur={handleBlur}
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

			<div class="flex flex-wrap items-end gap-6 p-4 pt-3 bg-slate-50 rounded-xl border border-slate-200">
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
				<div class="flex-1 flex items-end min-w-62.5 gap-3">
					<ColorSwatch
						class="w-10 h-10 rounded-full border-slate-400 border shadow-sm"
						value={parseColor(formData.color ?? "rgb(0,0,0)")}
					/>
					<TextField
						class="flex flex-col gap-1 flex-1"
						value="color"
						onChange={createFieldChangeHandler("color")}
					>
						<TextField.Label class="text-sm font-medium text-slate-700">
							Color
						</TextField.Label>
						<TextField.Input
							type="color"
							class="w-full px-3 py-2 rounded-md border border-slate-300 
             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
             cursor-pointer"
						/>
					</TextField>
				</div>
			</div>

			{/* Tags */}
			<TagsField
				name="tags"
				value={formData.tags}
				onChange={createFieldChangeHandler("tags")}
				onBlur={handleBlur}
				label="Tags"
				suggestions={tagSuggestions()}
				error={(formErrors.tags as unknown as string) ?? ""}
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
				{todoFormStore.formType === "update" ? "Update" : "Create"}
			</button>
		</form>
	);
}
