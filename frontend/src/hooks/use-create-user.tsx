import { useMutation } from "@tanstack/react-query";

type CreateUserInput = {
	name: string;
	email?: string;
	phone: string;
	document: string;
};

const useCreateUser = () => {
	const mutation = useMutation({
		mutationKey: ["createUser"],
		mutationFn: async (input: CreateUserInput) => {
			const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:9002/api/";

			console.log(input);
			const response = await fetch(`${backendUrl}v1/user`, {
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
