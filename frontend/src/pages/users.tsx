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

import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer"
import useQueryUsers from "@/hooks/use-query-users"
import useCreateUser from "@/hooks/use-create-user"

const formSchema = z.object({
	name: z.string(),
	phone: z.string(),
	email: z.string().optional(),
	document: z.string(),
});

const UserForm = () => {
	const { mutateAsync } = useCreateUser();
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
	})

	async function onSubmit(values: z.infer<typeof formSchema>) {
		try {
			await mutateAsync(values);
		} catch (error) {
			console.error("Form submission error", error);
			toast.error("Failed to submit the form. Please try again.");
		}
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-3xl mx-auto">
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
							<FormDescription>This is the user's display name.</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name="document"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Document</FormLabel>
							<FormControl>
								<Input
									placeholder="XXX.XXX.XXX-XX"
									type="text"
									{...field} />
							</FormControl>
							<FormDescription>This is required</FormDescription>
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
				<Button type="submit" className="w-full">Submit</Button>
			</form>
		</Form>
	)
}

const UserList = () => {
	const { data, isLoading, isError } = useQueryUsers();

	if (isError) {
		toast.error("Failed to fetch users");
	}

	if (isLoading) {
		return <p>Loading...</p>;
	}

	if (!data) {
		return <p>No users found</p>;
	}

	return (<Container className="grid grid-cols-3 gap-10">
		{data.map((user) => (<Card key={user.ID}>
			<CardHeader className="flex flex-row gap-3">
				<div>
					<Avatar>
						<AvatarImage src="https://github.com/shadcn.png" className="flex justify-center	items-center" />
						<AvatarFallback>G</AvatarFallback>
					</Avatar>
				</div>
				<div className="flex flex-col justify-center">
					<CardTitle>{user.Name}</CardTitle>
					<CardDescription>{user.Phone}</CardDescription>
				</div>
			</CardHeader>
			<CardContent>
				<p>{user.Email}</p>
			</CardContent>
			<CardFooter className="flex justify-end gap-3">
				<Button variant="ghost">Edit</Button>
				<Button variant="secondary">Delete</Button>
			</CardFooter>
		</Card>))}
	</Container>);
}

const SystemUsers = () => {
	return (<>
		<h1 className="text-2xl font-semibold text-gray-800">System Users</h1>
		<Drawer>
			<DrawerTrigger asChild className="left-0 w-20 my-5">
				<Button variant="default">Add User</Button>
			</DrawerTrigger>
			<DrawerContent className="mx-auto w-full max-w-sm">
				<DrawerHeader>
					<DrawerTitle>New User</DrawerTitle>
					<DrawerDescription>Fill the form to add a new user to the system.</DrawerDescription>
					<UserForm />
				</DrawerHeader>
				<DrawerFooter>
					<DrawerClose asChild>
						<Button variant="outline" className="w-full">Cancel</Button>
					</DrawerClose>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>

		<UserList />
	</>)
}

export default SystemUsers
