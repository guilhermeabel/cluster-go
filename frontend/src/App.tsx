import './App.css'
import axios from 'axios';
import React from 'react';
import { Container } from './components/ui/container';
import { Button } from './components/ui/button';
import { toast } from "sonner"
import { SidebarTrigger } from './components/ui/sidebar';
import { Textarea } from "@/components/ui/textarea"

function App() {
	const [data, setData] = React.useState<unknown>();

	const fetchData = async (url: string) => {
		try {
			toast("Fetching...")
			const backendUrl = (import.meta.env.VITE_BACKEND_URL || "http://localhost:9002/api/") as string;
			const response = await axios.get(backendUrl + url);
			setData(response.data);
			toast.success("Success")
		} catch (error) {
			toast.error("Fail")
			console.log(error);
		}
	};

	return (<Container>
		<div className='flex flex-col flex-between'>
			<div className='flex justify-end'>
				<SidebarTrigger className='float-right' />
			</div>
			<div className="flex gap-3 flex-row">
				<Button className='w-32' onClick={() => fetchData("v1/healthcheck")}>
					healthcheck
				</Button>
				<Button variant={"secondary"} className='w-32' onClick={() => fetchData("v1/echo")}>
					send to queue
				</Button>
			</div>
			<div className="flex gap-3 flex-row mt-3 w-64">
				<Textarea value={JSON.stringify(data, null, 2)} disabled rows={5} />
			</div>
		</div>

	</Container>

	)
}

export default App
