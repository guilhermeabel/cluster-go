import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
	createBrowserRouter,
	RouterProvider,
} from "react-router-dom";
import { Toaster } from './components/ui/sonner.tsx'
import { SidebarProvider } from './components/ui/sidebar.tsx'
import { AppSidebar } from './components/app/app-sidebar.tsx'

const queryClient = new QueryClient()

const router = createBrowserRouter([
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
		element: <App />,
	}
]);

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<QueryClientProvider client={queryClient}>
			<SidebarProvider>
				<AppSidebar />
				<RouterProvider router={router} />
				<Toaster />
			</SidebarProvider>
		</QueryClientProvider>
	</StrictMode>,
)
