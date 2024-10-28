const useApiUrl = () => {
	return import.meta.env.VITE_BACKEND_URL || "http://localhost:9002/api/"
}

export default useApiUrl;
