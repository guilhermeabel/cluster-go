"use client"
import {
	toast
} from "sonner"
import {
	useForm
} from "react-hook-form"
import {
	zodResolver
} from "@hookform/resolvers/zod"
import * as z from "zod"
import {
	cn
} from "@/lib/utils"
import {
	Button
} from "@/components/ui/button"
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form"
import {
	format
} from "date-fns"
import {
	Popover,
	PopoverContent,
	PopoverTrigger
} from "@/components/ui/popover"

import {
	Calendar as CalendarIcon
} from "lucide-react"
import {
	Switch
} from "@/components/ui/switch"
import {
	Textarea
} from "@/components/ui/textarea"
import { Container } from "@/components/ui/container"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"

const formSchema = z.object({
	contact_email: z.string().email(),
	payment_due_date: z.coerce.date().optional(),
	notify_contact: z.boolean(),
	description: z.string().optional()
});

const CreateExpenseForm = () => {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			"payment_due_date": new Date()
		},
	})

	function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			console.log(values);
			toast(
				<pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
					<code className="text-white">{JSON.stringify(values, null, 2)}</code>
				</pre>
			);
		} catch (error) {
			console.error("Form submission error", error);
			toast.error("Failed to submit the form. Please try again.");
		}
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-3xl mx-auto py-10">

				<div className="grid grid-cols-12 gap-4">
					<div className="col-span-6">
						<FormField
							control={form.control}
							name="contact_email"
							render={({ field }) => (
								<FormItem className="flex flex-col">
									<FormLabel>Contact Email</FormLabel>
									<FormControl>
										<Input
											placeholder="email@example.com"
											type="email"
											{...field} />
									</FormControl>
									<FormDescription>The invoice's contact email.</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

					</div>

					<div className="col-span-6">
						<FormField
							control={form.control}
							name="payment_due_date"
							render={({ field }) => (
								<FormItem className="flex flex-col">
									<FormLabel>Due Date</FormLabel>
									<Popover>
										<PopoverTrigger asChild>
											<FormControl>
												<Button
													variant={"outline"}
													className={cn(
														"w-[260px] pl-3 text-left font-normal",
														!field.value && "text-muted-foreground"
													)}
												>
													{field.value ? (
														format(field.value, "PPP")
													) : (
														<span>Pick a date</span>
													)}
													<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
												</Button>
											</FormControl>
										</PopoverTrigger>
										<PopoverContent className="w-auto p-0" align="start">
											<Calendar
												mode="single"
												selected={field.value}
												onSelect={field.onChange}
												className="rounded-md border"
											/>
										</PopoverContent>
									</Popover>
									<FormDescription>The payment will be due on this date</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>

					</div>
				</div>

				<FormField
					control={form.control}
					name="notify_contact"
					render={({ field }) => (
						<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
							<div className="space-y-0.5">
								<FormLabel>Send email notifications</FormLabel>
								<FormDescription>When checked, this contact will receive emails about this payment, when the due date is close and on status updates.</FormDescription>
							</div>
							<FormControl>
								<Switch
									checked={field.value}
									onCheckedChange={field.onChange}
									aria-readonly
								/>
							</FormControl>
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="description"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Description</FormLabel>
							<FormControl>
								<Textarea
									placeholder="Describe the payment details"
									className="resize-none"
									{...field}
								/>
							</FormControl>
							<FormDescription>This is the description of the payment, which will be available to the contact.</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type="submit">Submit</Button>
			</form>
		</Form>
	)
}

const usersMock = [{
	name: "Guilherme",
	phone: "(55)98877-6655",
	email: "guilherme@gmail.com"
}, {
	name: "Guilherme",
	phone: "(55)98877-6655",
	email: "guilherme@gmail.com"
}, {

	name: "Guilherme",
	phone: "(55)98877-6655",
	email: "guilherme@gmail.com"
}];

const ExpensesList = () => {
	return (<Container className="grid grid-cols-3 gap-10">
		{usersMock.map((user, index) => (<Card key={index}>
			<CardHeader className="flex flex-row gap-3">
				<div>
					<Avatar>
						<AvatarImage src="https://github.com/shadcn.png" className="flex justify-center	items-center" />
						<AvatarFallback>G</AvatarFallback>
					</Avatar>
				</div>
				<div className="flex flex-col justify-center">
					<CardTitle>{user.name}</CardTitle>
					<CardDescription>{user.phone}</CardDescription>
				</div>
			</CardHeader>
			<CardContent>
				<p>{user.email}</p>
			</CardContent>
			<CardFooter className="flex justify-end gap-3">
				<Button variant="ghost">Edit</Button>
				<Button variant="secondary">Delete</Button>

			</CardFooter>
		</Card>))}
	</Container>);
}


const Expenses = () => {
	return (<>
		<h1 className="text-2xl font-semibold text-gray-800">Expenses</h1>
		<CreateExpenseForm />
		<ExpensesList />
	</>)
}

export default Expenses
