import { useQuery } from "@tanstack/react-query";
import axios from "axios"; // Ensure axios is imported

type User = {
	ID: number;
	Name: string;
	Email: string;
	Phone: string;
};

const useQueryUsers = () => {
	return useQuery<User[], Error>({
		queryKey: ["users"],
		queryFn: async () => {
			const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:9002/api/";
			try {
				const response = await axios.get<User[]>(`${backendUrl}v1/users`);
				return response.data;
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
			} catch (error: any) {
				throw new Error(error.response?.data?.message || "Failed to fetch users");
			}
		},
	});
};

export default useQueryUsers;
