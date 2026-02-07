import { Toast } from "@kobalte/core/toast";
import type { ParentProps } from "solid-js";
import { Sidebar } from "~/lib/components/ui/sidebar";

export default function Layout(props: ParentProps) {
	return (
		<div class="relative bg-background flex flex-row">
			<Toast.Region
				duration={4000}
				class="absolute w-full flex justify-center bg-none"
			>
				<Toast.List class="fixed top-0 flex flex-col gap-2 p-4 w-96 max-w-dvw m-0 list-none z-50 outline-none" />
			</Toast.Region>
			<Sidebar />
			{props.children}
		</div>
	);
}
