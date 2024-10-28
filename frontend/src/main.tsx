import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
	createBrowserRouter,
	RouterProvider,
} from "react-router-dom";
import { Toaster } from './components/ui/sonner.tsx'
import { SidebarProvider } from './components/ui/sidebar.tsx'
import Sidebar from './components/app/app-sidebar.tsx'
import Topbar from './components/app/app-topbar.tsx'
import { Container } from './components/ui/container.tsx'
import Test from './pages/tests.tsx';
import UserContacts from './pages/user-contacts.tsx';
import SystemUsers from './pages/users.tsx';

const queryClient = new QueryClient()

const router = createBrowserRouter([
	// Basic Routes
	{
		path: "/",
		element: <div>Home</div>,
	},
	{
		path: "/about",
		element: <div>About</div>,
	},
	{
		path: "/contact",
		element: <div>Contact</div>,
	},
	{
		path: "tests",
		element: <Test />,
	},
	// Features
	{
		path: "/contacts",
		element: <UserContacts />,
	},
	// System
	{
		path: "/users",
		element: <SystemUsers />,
	}
]);

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<QueryClientProvider client={queryClient}>
			<SidebarProvider>
				<Sidebar />
				<Container className='flex flex-col w-full px-10 py-5'>
					<Topbar />
					<RouterProvider router={router} />
				</Container>
			</SidebarProvider>
			<Toaster />
		</QueryClientProvider>
	</StrictMode>,
)
