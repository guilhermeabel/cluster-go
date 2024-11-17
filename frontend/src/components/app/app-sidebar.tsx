import { CircleDollarSign, MessageSquare, TestTubeDiagonal, Contact, User, Settings, Home, ChevronUp, Receipt, HandCoins } from "lucide-react"

import {
	Sidebar as InternalSidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarSeparator,
} from "@/components/ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const Sidebar = () => {
	return (
		<InternalSidebar collapsible="icon">
			<SidebarHeader>

			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Menu</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{defaultItems.map((item) => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton asChild>
										<a href={item.url}>
											<item.icon />
											<span>{item.title}</span>
										</a>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
				<SidebarSeparator />
				<SidebarGroup>
					<SidebarGroupLabel>Featured</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{featuredItems.map((item) => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton asChild>
										<a href={item.url}>
											<item.icon />
											<span>{item.title}</span>
										</a>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
				<SidebarSeparator />
				<SidebarGroup>
					<SidebarGroupLabel>System</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{systemItems.map((item) => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton asChild>
										<a href={item.url}>
											<item.icon />
											<span>{item.title}</span>
										</a>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter>
				<SidebarMenu>
					<SidebarMenuItem>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<SidebarMenuButton size="lg">
									<Avatar>
										<AvatarImage src="https://github.com/shadcn.png" className="flex justify-center	items-center" />
										<AvatarFallback>U</AvatarFallback>
									</Avatar> Username
									<ChevronUp className="ml-auto" />
								</SidebarMenuButton>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								side="top"
								className="w-[--radix-popper-anchor-width]"
							>
								<DropdownMenuItem>
									<span>Account</span>
								</DropdownMenuItem>
								<DropdownMenuItem>
									<span>Billing</span>
								</DropdownMenuItem>
								<DropdownMenuItem>
									<span>Sign out</span>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>
		</InternalSidebar>
	)
}

const defaultItems = [
	{
		title: "Home",
		url: "/",
		icon: Home,
	},
	{
		title: "About",
		url: "/about",
		icon: Contact,
	},
	{
		title: "Contact",
		url: "/contact",
		icon: MessageSquare,
	},
]

const featuredItems = [
	{
		title: "Contacts",
		url: "/contacts",
		icon: Contact,
	},
	{
		title: "Messages",
		url: "/messages",
		icon: MessageSquare,
	},
	{
		title: "Finances",
		url: "/finances",
		icon: CircleDollarSign,
	},
	{
		title: "Invoices",
		url: "/invoices",
		icon: Receipt,
	},
	{
		title: "Expenses",
		url: "/expenses",
		icon: HandCoins,
	},
]

const systemItems = [
	{
		title: "Tests",
		url: "tests",
		icon: TestTubeDiagonal,
	},
	{
		title: "Users",
		url: "/users",
		icon: User,
	},
	{
		title: "Settings",
		url: "/system-settings",
		icon: Settings,
	},
]

export default Sidebar
