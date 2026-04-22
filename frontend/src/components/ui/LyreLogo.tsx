import { cn } from "@/lib/utils";

type LyreLogoProps = {
	className?: string;
	labelClassName?: string;
	markClassName?: string;
	showLabel?: boolean;
};

const LyreLogo = ({
	className,
	labelClassName,
	markClassName,
	showLabel = false,
}: LyreLogoProps) => {
	return (
		<div className={cn("flex items-center gap-2", className)}>
			<div
				className={cn(
					"flex items-center justify-center rounded-full text-primary",
					"size-8 text-[1.75rem] leading-none",
					markClassName
				)}
				aria-hidden='true'
			>
				♭
			</div>
			{showLabel ? (
				<span className={cn("font-medium tracking-tight text-white", labelClassName)}>Lyre</span>
			) : null}
		</div>
	);
};

export default LyreLogo;
