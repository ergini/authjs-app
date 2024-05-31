import { signIn } from "@/auth"

export default async function SignInPage() {
    return (
        <div className="flex flex-col gap-2">
            <form
                className="flex flex-col gap-2 w-64 p-4 border border-gray-300 rounded-md shadow-md"
                action={async (formData) => {
                    "use server"
                    await signIn("credentials", formData)
                }}
            >
                <label>
                    Email
                </label>
                <input
                    type="email"
                    name="email"
                    required
                />
                <label>
                    Password
                </label>
                <input
                    type="password"
                    name="password"
                    required
                />
                <button type="submit">
                    <span>Sign in</span>
                </button>
            </form>
        </div>
    )
}