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
import Invoices from './pages/user-receivables.tsx';
import Expenses from './pages/user-payables.tsx';

const queryClient = new QueryClient()

const loadBasicRoutes = () => {
	return [
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
	]
}

const loadSystemRoutesRoutes = () => {
	return [
		{
			path: "tests",
			element: <Test />,
		},
		{
			path: "/users",
			element: <SystemUsers />,
		}
	]
}

const loadFeaturedRoutes = () => {
	return [
		{
			path: "/contacts",
			element: <UserContacts />,
		},
		{
			path: "/invoices",
			element: <Invoices />,
		},
		{
			path: "/expenses",
			element: <Expenses />,
		},
	]
}

const router = createBrowserRouter([
	...loadBasicRoutes(),
	...loadFeaturedRoutes(),
	...loadSystemRoutesRoutes(),
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
