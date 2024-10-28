import React from "react"

const Container = React.forwardRef<HTMLDivElement, React.AllHTMLAttributes<HTMLDivElement>>(
	({ children, ...props }, ref) => {
		return (
			<div
				ref={ref}
				className="container px-2 w-full mx-auto"
				{...props}
			>
				{children}
			</div>
		)
	}
)

Container.displayName = "Container"

export { Container }
