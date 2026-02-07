import { Button } from "@kobalte/core/button";
import { TextField } from "@kobalte/core/text-field";
import { X } from "lucide-solid";
import { createEffect, createMemo, createSignal, For, Show } from "solid-js";
import type { BlurEvent } from "~/lib/types";
import { cn } from "~/lib/utils/cn";

/*
 * DONE: Improve visual styles e.g the clear button
 * DONE: Display autocompletion hint on the input
 * DONE: Display a hint after user has tried to enter a duplicate tag
 * DONE: Do a proper render of error messages
 * */

interface Props {
	name?: string;
	value: string[];
	error?: string;
	maxTags?: number;
	maxTagLength?: number;
	suggestions?: string[];
	label?: string;
	onChange: (newTags: string[]) => void;
	onBlur: (e: BlurEvent) => void;
}
// NOTE: I mean it's not the best but it kinda works..
export function TagsField(props: Props) {
	const { maxTags = 20, maxTagLength = 255 } = props;
	// Used to hide suggestions and
	const [hideSuggestions, setHideSuggestions] = createSignal(false);
	const [inputValue, setInputValue] = createSignal("");
	const [duplicateTagIndex, setDuplicateTagIndex] = createSignal(-1);

	// Filter out suggestions
	const suggestions = createMemo(() => {
		if (!inputValue()) return [];
		if (!Array.isArray(props.suggestions)) return [];
		const format = (s: string) => s.toLowerCase().trim();

		// NOTE: Probably not the best way to do it. But it works! Kinda...
		// NOTE: Improve? Maybe?
		const filteredSuggestions = props.suggestions.filter((v: string) =>
			format(v).includes(format(inputValue())),
		);
		return filteredSuggestions.sort((s) => {
			return format(s).startsWith(format(inputValue())) ? -1 : 1;
		});
	});

	const addTag = (
		tag: string,
		currentTags: string[],
		onChange: (tags: string[]) => void,
	) => {
		// Skip if there are already max tags
		if (maxTags && currentTags.length >= maxTags) return;

		const trimmedTag = tag.trim();
		if (!trimmedTag || trimmedTag.length > maxTagLength) return;

		const duplicateTagIndex = currentTags.indexOf(trimmedTag);
		// Skip duplicates
		if (duplicateTagIndex !== -1) {
			setInputValue("");
			setDuplicateTagIndex(duplicateTagIndex);
			return;
		}

		onChange([...currentTags, trimmedTag]);
		setInputValue("");
	};

	const removeTag = (
		index: number,
		currentTags: string[],
		onChange: (tags: string[]) => void,
	) => {
		// Skipping since tags is empty anyway
		if (currentTags.length === 0) return;
		const newTags = currentTags.filter((_, i) => i !== index);
		onChange(newTags);
	};

	function handleKeyDown(e: KeyboardEvent) {
		const { value: currentTags, onChange } = props;
		if (e.key === "Enter" || e.key === ",") {
			e.preventDefault();
			addTag(inputValue(), currentTags, onChange);
		}
		if (e.key === "Backspace" && !inputValue()) {
			removeTag(currentTags.length - 1, currentTags, onChange);
		}

		if (e.key === "Escape") {
			setHideSuggestions(true);
		}

		const [first] = suggestions() ?? [];
		// In case there is a suggestion available
		// We want to use that to autocomplete tag creation
		if (e.key === "Tab" && first && inputValue() !== first) {
			e.preventDefault();
			addTag(first, currentTags, onChange);
		}
	}

	function createRemoveTagClickHandler(idx: number) {
		return () => {
			props.onChange(props.value.filter((_, i) => i !== idx));
		};
	}

	function handleClearTags() {
		props.onChange([]);
		setInputValue("");
	}

	// Reset hideSuggestions
	createEffect(() => {
		if (!inputValue()) setHideSuggestions(false);
	});
	// Reset duplicate tag index to hide the tag error state
	createEffect(() => {
		if (duplicateTagIndex() === -1) return;
		const timeoutId = setTimeout(() => {
			setDuplicateTagIndex(-1);
		}, 400);
		return () => clearTimeout(timeoutId);
	});

	return (
		<TextField
			name={props.name}
			value={inputValue()}
			onChange={setInputValue}
			onKeyDown={handleKeyDown}
			class={cn(
				"relative min-h-10 p-2 rounded-md",
				"bg-background border border-border hover:border-(--accent-hover) transition-colors",
				"text-foreground",
			)}
			validationState={props.error ? "invalid" : "valid"}
			aria-autocomplete="none"
		>
			{/* Tags  */}
			<div class="flex flex-wrap gap-2">
				<For each={props.value}>
					{(tag, i) => (
						<div
							class={cn(
								"select-none flex items-center gap-1 px-2 py-1 rounded-md bg-primary/10 text-foreground",
								" border border-border/20 text-sm transition-colors duration-300",
								{
									"border border-(--error)": duplicateTagIndex() === i(),
								},
							)}
						>
							{/* FIXME: Doesn't account for screen width */}
							{tag.slice(0, 50)}
							{tag.length > 50 ? "..." : ""}
							<button
								type="button"
								onClick={createRemoveTagClickHandler(i())}
								class="ml-1 w-4 h-4 flex items-center justify-center rounded-full hover:text-(--error)"
								aria-label={`Remove ${tag}`}
							>
								<X class="w-3 h-3" />
							</button>
						</div>
					)}
				</For>
			</div>

			<div
				class={cn("flex-1 flex gap-2 items-center", {
					"mt-4": props.value.length > 0,
				})}
			>
				{/* Input container */}
				<div class="flex-1 relative flex overflow-y-scroll items-center">
					{/* Auto complete hint  */}
					{/* FIXME: Autocomplete hint sucks */}
					<Show when={!hideSuggestions()}>
						<span class="absolute px-2 p-1 text-foreground/50 text-sm select-none">
							{suggestions()[0] ?? ""}
						</span>
					</Show>
					{/* Tags input  */}
					<TextField.Input
						aria-label="Todo tags"
						placeholder="Add tag..."
						class="relative z-10 flex-1 px-2 py-1 rounded bg-transparent border-none focus:outline-none focus:ring-0 text-sm"
						onBlur={props.onBlur}
						maxLength={maxTagLength}
					/>
					<span class="text-xs text-gray-500">
						{inputValue().length}/{maxTagLength}
					</span>
				</div>

				{/* Buttons */}
				<Button
					class="hover:bg-(--accent-hover) hover:text-background text-foreground p-1 rounded-sm transition-colors duration-200"
					onClick={() => addTag(inputValue(), props.value, props.onChange)}
				>
					Add
				</Button>
				<Button
					class="hover:bg-(--accent-destructive) hover:text-background text-foreground p-1 rounded-sm transition-colors duration-200"
					onClick={handleClearTags}
				>
					Clear
				</Button>
			</div>
			{/* Error message */}
			<TextField.ErrorMessage class="text-red-500 text-sm p-2">
				{props.error}
			</TextField.ErrorMessage>
			{/* Suggestions */}
			<Show when={suggestions().length > 0 && !hideSuggestions()}>
				<div
					class="absolute top-full left-0 mt-1 w-full min-w-30 max-h-60 overflow-y-auto bg-background 
					rounded-md shadow-lg border border-border z-50"
				>
					<For each={suggestions()}>
						{(s, i) => (
							<button
								onClick={() => addTag(s, props.value, props.onChange)}
								class={cn(
									"w-full text-left block px-3 py-2 text-sm text-foreground",
									" hover:text-accent cursor-pointer transition-colors duration-150",
									{
										"text-(--accent-hover)": i() === 0,
									},
								)}
								type="button"
							>
								{s}
							</button>
						)}
					</For>
				</div>{" "}
			</Show>

			<div class="absolute -bottom-6 right-2 text-xs">
				{props.value.length}/{maxTags}
			</div>
		</TextField>
	);
}
