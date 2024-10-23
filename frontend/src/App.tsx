import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from 'axios';
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react';

const fetchData = async (url: string) => {
	const response = await axios.get(url);
	return response.data
};

function App() {
	const [url, setUrl] = useState<string | null>(null);
	const backendUrl = import.meta.env.VITE_BACKEND_URL as string;

	const { data, isLoading, refetch } = useQuery(
		{
			queryKey: ['fetchData', url],
			queryFn: () => fetchData(url!),
			enabled: false,
		}
	);

	const getHealthcheck = () => {
		setUrl(`${backendUrl}/v1/healthcheck`);
		refetch();
	};

	const getEcho = () => {
		setUrl(`${backendUrl}/v1/echo`);
		refetch();
	}

	const getPing = () => {
		setUrl(`${backendUrl}/v1/ping`);
		refetch();
	}


	return (
		<>
			<div>
				<a href="https://vitejs.dev" target="_blank">
					<img src={viteLogo} className="logo" alt="Vite logo" />
				</a>
				<a href="https://react.dev" target="_blank">
					<img src={reactLogo} className="logo react" alt="React logo" />
				</a>
			</div>
			<h1>Vite + React</h1>
			<div style={{ minHeight: "350px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
				<div className="card" style={{ "display": "flex", "gap": "40px" }}>
					<button onClick={getHealthcheck}>
						request 1
					</button>
					<button onClick={getEcho}>
						request 2
					</button>
					<button onClick={getPing}>
						request 3
					</button>
				</div>
				{url && data ? <div style={{ backgroundColor: "#111", borderRadius: "9px", padding: "30px" }}>
					<pre>{JSON.stringify(data, null, 2)}</pre>
				</div> : <></>}
				<div style={{ minHeight: "30px", margin: "15px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
					{isLoading && <>Loading</>}
				</div>
			</div>
		</>
	)
}

export default App
