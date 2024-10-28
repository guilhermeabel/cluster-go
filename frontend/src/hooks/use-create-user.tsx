import { useMutation } from "@tanstack/react-query";
import useApiUrl from "./use-api-url";

type CreateUserInput = {
	name: string;
	email?: string;
	phone: string;
	document: string;
};

const useCreateUser = () => {
	const apiUrl = useApiUrl();
	const mutation = useMutation({
		mutationKey: ["createUser"],
		mutationFn: async (input: CreateUserInput) => {
			const response = await fetch(`${apiUrl}v1/user`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(input),
			});

			if (!response.ok) {
				throw new Error("Failed to create user");
			}
		}
	});

	return mutation;
}

export default useCreateUser;
