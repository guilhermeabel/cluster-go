import './App.css'
import axios from 'axios';
import React from 'react';



function App() {
	const [data, setData] = React.useState<unknown>();

	const fetchData = async (url: string) => {
		const backendUrl = (import.meta.env.VITE_BACKEND_URL || "http://localhost:9002/api/") as string;
		const response = await axios.get(backendUrl + url);
		setData(response.data);
	};

	return (
		<>
			<div style={{ minHeight: "350px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
				<div className="card" style={{ "display": "flex", "gap": "40px" }}>
					<button onClick={() => fetchData("v1/healthcheck")}>
						healthcheck
					</button>
					<button onClick={() => fetchData("v1/echo")}>
						send to queue
					</button>
					{/* <button onClick={}>
						request 3
					</button> */}
				</div>
				{data ? <div style={{ backgroundColor: "#111", borderRadius: "9px", padding: "30px", maxWidth: "300px" }}>
					<pre style={{ "overflow": "scroll" }}>{JSON.stringify(data, null, 2)}</pre>
				</div> : <></>}
			</div>
		</>
	)
}

export default App
