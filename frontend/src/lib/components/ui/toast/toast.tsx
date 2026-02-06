import { Toast, toaster } from "@kobalte/core/toast";
import { Check, X } from "lucide-solid";
import { type Accessor, createMemo, type ParentProps } from "solid-js";
import type { JSX } from "solid-js/jsx-runtime";
import { Match, Show, Switch } from "solid-js/web";
import { cn } from "~/lib/utils/cn";
import { Spinner } from "../spinner";

interface Props {
	className?: string;
	description?: string | JSX.Element;
	toastId: number;
	showProgress?: Accessor<boolean>;
}

function ToastBase({
	description,
	className,
	toastId,
	children,
	...props
}: Props & ParentProps) {
	return (
		<Toast
			toastId={toastId}
			class={cn(
				"flex flex-col gap-3 p-4 bg-background border border-border/50 shadow-lg rounded-lg backdrop-blur-sm",
				className,
			)}
		>
			{/* Header */}
			<div class="flex items-start w-full gap-3">
				<div class="flex-1 min-w-0">
					<Toast.Title class="font-semibold text-foreground text-base leading-tight truncate">
						{children}
					</Toast.Title>
					<Show when={description}>
						<Toast.Description class="text-sm text-gray-500 mt-1 leading-relaxed">
							{description}
						</Toast.Description>
					</Show>
				</div>
				<Toast.CloseButton class="group p-1.5 -m-1.5 rounded-lg text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200 flex-shrink-0">
					<X class="w-4 h-4" />
				</Toast.CloseButton>
			</div>

			{/* Progress */}
			{/* <Show when={props.showProgress?.()}> */}
			{/* 	<Toast.ProgressTrack class="h-1.5 bg-gray-200/50 rounded-full overflow-hidden shadow-inner"> */}
			{/* 		<Toast.ProgressFill */}
			{/* 			class="h-full bg-accent rounded-sm */}
			{/*        transition-all duration-200 ease-linear w-(--kb-toast-progress-fill-width)" */}
			{/* 		/> */}
			{/* 	</Toast.ProgressTrack> */}
			{/* </Show> */}
		</Toast>
	);
}

function show(
	message: JSX.Element | string,
	description?: JSX.Element | string,
) {
	return toaster.show((props) => (
		<ToastBase toastId={props.toastId} description={description}>
			{message}
		</ToastBase>
	));
}

function success(
	message: JSX.Element | string,
	description?: JSX.Element | string,
) {
	return toaster.show((props) => (
		<ToastBase toastId={props.toastId} description={description}>
			<span class="flex gap-2 items-center">
				<Check class="size-6 text-(--success)" />
				{message}
			</span>
		</ToastBase>
	));
}

function error(
	message: JSX.Element | string,
	description?: JSX.Element | string,
) {
	return toaster.show((props) => (
		<ToastBase
			class="border-(--error)"
			toastId={props.toastId}
			description={description}
		>
			<span class="flex gap-2 items-center">
				<X class="size-6 text-(--error)/50" />
				{message}
			</span>
		</ToastBase>
	));
}

type Renderable = JSX.Element | string;
function promise<T, U>(
	promise: Promise<T> | (() => Promise<T>),
	options: {
		loading?: Renderable;
		success?: Renderable | ((data: T) => JSX.Element);
		error?: Renderable | ((error: U) => JSX.Element);
	} = {},
) {
	const renderTitle = <D,>(
		icon: JSX.Element,
		text: Renderable | ((promiseResult: D) => JSX.Element),
		data?: D,
	): JSX.Element => {
		if (typeof text === "string") {
			return (
				<span class="flex gap-2 items-center">
					{icon}
					{text}
				</span>
			);
		}
		if (typeof text === "function") {
			return text(data!);
		}
		return text;
	};

	return toaster.promise(promise, (props) => (
		<ToastBase
			toastId={props.toastId}
			class={cn({
				"border-(--error)/50": props.state === "rejected",
			})}
			showProgress={createMemo(
				() => props.state === "fulfilled" || props.state === "rejected",
			)}
		>
			<Switch>
				<Match when={props.state === "pending"}>
					{renderTitle(<Spinner class="size-6 text-accent" />, options.loading)}
				</Match>
				<Match when={props.state === "fulfilled"}>
					{renderTitle(
						<Check class="size-6 text-(--success)" />,
						options.success ?? "Success",
						props.data,
					)}
				</Match>
				<Match when={props.state === "rejected"}>
					{renderTitle(
						<X class="size-6 text-(--error)" />,
						options.error ?? "Failed",
						props.data as U,
					)}{" "}
				</Match>
			</Switch>
		</ToastBase>
	));
}
function custom(jsx: () => JSX.Element) {
	return toaster.show((props) => (
		<Toast toastId={props.toastId}>{jsx()}</Toast>
	));
}
function dismiss(id: number) {
	return toaster.dismiss(id);
}
export const toast = {
	show,
	success,
	error,
	promise,
	custom,
	dismiss,
};
