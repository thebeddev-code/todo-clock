import { Toast } from "@kobalte/core/toast";
import type { ParentProps } from "solid-js";

export default function Layout(props: ParentProps) {
	return (
		<div class="relative bg-background">
			<Toast.Region duration={4000} class="w-full flex justify-center">
				<Toast.List class="fixed top-0 flex flex-col gap-2 p-4 w-96 max-w-dvw m-0 list-none z-50 outline-none" />
			</Toast.Region>
			{props.children}
		</div>
	);
}
