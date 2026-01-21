import { TextField } from "@kobalte/core/text-field";
import { createEffect, createMemo, createSignal, For, Show } from "solid-js";
import { cn } from "~/lib/utils/cn";
import { Plus, X } from "lucide-solid";
import { Button } from "@kobalte/core/button";

/*
 * TODO: Improve visual styles e.g the clear button
 * TODO: Display completion hint on the input
 * TODO: Display a hint after user has tried to enter a duplicate tag
 * TODO: Do a proper render of error message
 * */

interface Props {
  value: string[];
  onChange: (newTags: string[]) => void;
  error?: string;
  maxTags?: number;
  maxTagLength?: number;
  suggestions?: string[];
  label?: string;
}

export function TagsField(props: Props) {
  const { maxTags = 20, maxTagLength = 255 } = props;

  const [hideSuggestions, setHideSuggestions] = createSignal(false);
  const [inputValue, setInputValue] = createSignal("");
  const suggestions = createMemo(() => {
    if (!inputValue()) return [];
    if (!Array.isArray(props.suggestions)) return [];
    // beatiful line
    return props.suggestions.filter((v: string) =>
      v.toLowerCase().trim().includes(inputValue().toLowerCase().trim()),
    );
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

    // Skip duplicates
    if (currentTags.includes(trimmedTag)) {
      setInputValue("");
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
    const newTags = currentTags.filter((_, i) => i !== index);
    onChange(newTags);
  };

  function handleKeyDown(e: KeyboardEvent) {
    const { value: currentTags, onChange } = props;
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(inputValue(), currentTags, onChange);
    }
    if (e.key === "Backspace" && !inputValue() && currentTags.length > 0) {
      removeTag(currentTags.length - 1, currentTags, onChange);
    }
    if (e.key === "Escape") {
      setHideSuggestions(true);
    }
    const [first] = suggestions() ?? [];
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
  // reset hideSuggestions
  createEffect(() => {
    if (!inputValue()) setHideSuggestions(false);
  });

  return (
    <TextField
      value={inputValue()}
      onChange={setInputValue}
      onKeyDown={handleKeyDown}
      class={cn(
        "relative min-h-10 p-2 rounded-md flex flex-wrap gap-2 items-center",
        "bg-background border border-border hover:border-primary/50 transition-colors",
      )}
      validationState={props.error ? "invalid" : "valid"}
      aria-autocomplete="none"
    >
      {" "}
      <div class="flex flex-wrap gap-2">
        <For each={props.value}>
          {(tag, i) => (
            <span class="select-none flex items-center gap-1 px-2 py-1 rounded-md bg-primary/10 text-primary border border-primary/20 text-sm">
              {tag}
              <button
                onClick={createRemoveTagClickHandler(i())}
                class="ml-1 w-4 h-4 flex items-center justify-center rounded-full hover:bg-black/20"
                aria-label={`Remove ${tag}`}
              >
                <X class="w-3 h-3" />
              </button>
            </span>
          )}
        </For>
      </div>
      <div class="flex-1 flex gap-2 items-center">
        <TextField.Input
          aria-label="Todo tags"
          placeholder="Add tag..."
          class="flex-1 px-2 py-1 rounded border border-transparent focus:outline-none focus:ring-0 text-sm"
        />
        <Button
          onClick={() => addTag(inputValue(), props.value, props.onChange)}
        >
          Add
        </Button>
        <Button onClick={handleClearTags}>Clear</Button>
        <TextField.ErrorMessage>{props.error}</TextField.ErrorMessage>
      </div>
      <Show when={suggestions().length > 0 && !hideSuggestions()}>
        <div class="absolute top-full left-0 mt-1 w-full min-w-30 max-h-60 overflow-y-auto bg-white rounded-md shadow-lg border border-gray-200 z-50">
          <For each={suggestions()}>
            {(s) => (
              <span
                onClick={() => addTag(s, props.value, props.onChange)}
                class="block px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 cursor-pointer transition-colors duration-150"
              >
                {s}
              </span>
            )}
          </For>
        </div>{" "}
      </Show>
    </TextField>
  );
}
