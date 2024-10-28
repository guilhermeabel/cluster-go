import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import useApiUrl from "./use-api-url";

type User = {
	ID: number;
	Name: string;
	Email: string;
	Phone: string;
};

const useQueryUsers = () => {
	const apiUrl = useApiUrl();
	return useQuery<User[], Error>({
		queryKey: ["users"],
		queryFn: async () => {
			try {
				const response = await axios.get<User[]>(`${apiUrl}v1/users`);
				return response.data;
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
			} catch (error: any) {
				throw new Error(error.response?.data?.message || "Failed to fetch users");
			}
		},
	});
};

export default useQueryUsers;
