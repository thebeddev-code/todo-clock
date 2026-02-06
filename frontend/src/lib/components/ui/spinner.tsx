import { LoaderCircle } from "lucide-solid";
import { cn } from "~/lib/utils/cn";

interface Props {
	className?: string;
}
export function Spinner({ className, ...props }: Props) {
	return (
		<LoaderCircle
			aria-label="Loading"
			class={cn("size-4 animate-spin inline", className)}
			{...props}
		/>
	);
}
