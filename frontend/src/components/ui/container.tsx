import React from "react"

const Container = React.forwardRef<HTMLDivElement, React.AllHTMLAttributes<HTMLDivElement>>(
	({ children, ...props }, ref) => {
		return (
			<div
				ref={ref}
				className="container mx-auto px-4 sm:px-6 lg:px-8"
				{...props}
			>
				{children}
			</div>
		)
	}
)
Container.displayName = "Container"

export { Container }
