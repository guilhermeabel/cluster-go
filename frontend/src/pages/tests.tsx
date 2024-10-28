import axios from 'axios';
import React from 'react';
import { Container } from '../components/ui/container';
import { Button } from '../components/ui/button';
import { toast } from "sonner"

const Test = () => {
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
		<h1 className="text-2xl font-semibold text-gray-800 mb-5">Testing 🧪</h1>
		<div className='flex flex-col flex-between'>
			<div className="flex gap-3 flex-row">
				<Button className='w-32' onClick={() => fetchData("v1/healthcheck")}>
					healthcheck
				</Button>
				<Button variant={"secondary"} className='w-32' onClick={() => fetchData("v1/echo")}>
					send to queue
				</Button>
			</div>
			<div className="flex gap-3 flex-row mt-3 w-64">
				<pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4 min-w-[340px] min-h-[540px]">
					<code className="text-white">{JSON.stringify(data, null, 2)}</code>
				</pre>
			</div>
		</div>

	</Container>

	)
}

export default Test
