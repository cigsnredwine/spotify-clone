import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

interface AuthPageProps {
	mode: "sign-in" | "sign-up";
}

const AuthPage = ({ mode }: AuthPageProps) => {
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState(false);
	const [authError, setAuthError] = useState("");
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const isSignUp = mode === "sign-up";

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setAuthError("");
		setIsLoading(true);

		try {
			if (isSignUp) {
				const response = await authClient.signUp.email({
					name,
					email,
					password,
				});

				if (response.error) {
					throw new Error(response.error.message || "Unable to create account");
				}

				toast.success("Account created successfully");
			} else {
				const response = await authClient.signIn.email({
					email,
					password,
				});

				if (response.error) {
					throw new Error(response.error.message || "Unable to sign in");
				}

				toast.success("Signed in successfully");
			}

			navigate("/");
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : "Authentication failed";

			if (!isSignUp && /invalid|wrong password|password/i.test(errorMessage)) {
				setAuthError("Wrong password. Try again.");
			} else {
				toast.error(errorMessage);
			}
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className='min-h-screen bg-black text-white flex items-center justify-center p-6'>
			<Card className='w-full max-w-md bg-zinc-900 border-zinc-800'>
				<CardHeader>
					<CardTitle>{isSignUp ? "Create your account" : "Sign in to Lyre"}</CardTitle>
					<CardDescription>
						{isSignUp ? "Start uploading, chatting, and listening." : "Welcome back."}
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form className='space-y-4' onSubmit={handleSubmit}>
						{isSignUp && (
							<div className='space-y-2'>
								<label className='text-sm font-medium'>Name</label>
								<Input
									value={name}
									onChange={(event) => {
										setName(event.target.value);
										setAuthError("");
									}}
									className='bg-zinc-800 border-zinc-700'
									placeholder='Your name'
									required
								/>
							</div>
						)}

						<div className='space-y-2'>
							<label className='text-sm font-medium'>Email</label>
							<Input
								type='email'
								value={email}
								onChange={(event) => {
									setEmail(event.target.value);
									setAuthError("");
								}}
								className='bg-zinc-800 border-zinc-700'
								placeholder='you@example.com'
								required
							/>
						</div>

						<div className='space-y-2'>
							<label className='text-sm font-medium'>Password</label>
							<Input
								type='password'
								value={password}
								onChange={(event) => {
									setPassword(event.target.value);
									setAuthError("");
								}}
								className='bg-zinc-800 border-zinc-700'
								placeholder='At least 8 characters'
								required
							/>
							{authError && <p className='text-sm text-red-500'>{authError}</p>}
						</div>

						<Button type='submit' className='w-full' disabled={isLoading}>
							{isLoading ? "Working..." : isSignUp ? "Create Account" : "Sign In"}
						</Button>
					</form>

					<p className='mt-4 text-sm text-zinc-400'>
						{isSignUp ? "Already have an account?" : "Need an account?"}{" "}
						<Link to={isSignUp ? "/login" : "/signup"} className='text-blue-400 hover:underline'>
							{isSignUp ? "Sign in" : "Create one"}
						</Link>
					</p>
				</CardContent>
			</Card>
		</div>
	);
};

export default AuthPage;
