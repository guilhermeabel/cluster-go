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
	Input
} from "@/components/ui/input"
import { Container } from "@/components/ui/container"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar } from "@/components/ui/avatar"
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"

const formSchema = z.object({
	name: z.string(),
	phone: z.string(),
	email: z.string().optional()
});

const UserContactsForm = () => {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
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

				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Name</FormLabel>
							<FormControl>
								<Input
									placeholder="William Abagnale"

									type="text"
									{...field} />
							</FormControl>
							<FormDescription>This is the contact's display name.</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<div className="grid grid-cols-12 gap-4">

					<div className="col-span-6">

						<FormField
							control={form.control}
							name="phone"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Phone</FormLabel>
									<FormControl>
										<Input
											placeholder="(XX) XXXXX-XXXX"

											type="text"
											{...field} />
									</FormControl>
									<FormDescription>This is required</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					<div className="col-span-6">

						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input
											placeholder="example@mail.com"

											type="email"
											{...field} />
									</FormControl>
									<FormDescription>This is optional</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

				</div>
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

const UserContactsList = () => {
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


const UserContacts = () => {
	return (<>
		<h1 className="text-2xl font-semibold text-gray-800">Contacts</h1>
		<UserContactsForm />
		<UserContactsList />
	</>)
}

export default UserContacts
