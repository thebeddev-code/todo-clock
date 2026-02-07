import { A } from "@solidjs/router";
import {
	CalendarIcon,
	ChevronLeftIcon,
	ChevronRightIcon,
	ListTodo,
	SettingsIcon,
} from "lucide-solid";
import { createSignal } from "solid-js";
import { cn } from "~/lib/utils/cn";

export function Sidebar() {
	const [collapsed, setCollapsed] = createSignal(false);

	const toggleSidebar = () => setCollapsed((b) => !b);

	return (
		<aside
			class={cn(
				"relative bg-background h-dvh border-r border-border flex flex-col transition-all duration-300",
			)}
		>
			<button
				type="button"
				onClick={toggleSidebar}
				class="absolute left-[110%] mt-2 p-2 rounded-full hover:bg-gray-200 transition"
			>
				{collapsed() ? (
					<ChevronRightIcon size={20} />
				) : (
					<ChevronLeftIcon size={20} />
				)}
			</button>

			{/* Links - Top */}
			<nav class="flex-1 px-2 py-4 space-y-2">
				<A
					href="/"
					class="flex items-center justify-center gap-2 p-3 text-sm text-foreground hover:bg-accent rounded-lg transition group"
				>
					<ListTodo size={20} />
					{!collapsed() && <span>Activities</span>}
				</A>

				<A
					href="/calendar"
					class="flex items-center justify-center gap-2 p-3 text-sm text-foreground hover:bg-accent rounded-lg transition group"
				>
					<CalendarIcon size={20} />
					{!collapsed() && <span>Calendar</span>}
				</A>
			</nav>

			{/* Links - Bottom */}
			<div class="px-2 pb-4">
				<a
					href="/settings"
					class="flex items-center justify-center gap-2 p-3 text-sm text-foreground hover:bg-accent rounded-lg transition group"
				>
					<SettingsIcon size={20} />
					{!collapsed() && <span>Settings</span>}
				</a>
			</div>
		</aside>
	);
}
