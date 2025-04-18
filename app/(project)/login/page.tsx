import { handleAuth } from "@/app/actions/authenticate";

export default function Login() {
  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-8">
      <h1 className="text-4xl font-bold">Login</h1>

      <form action={handleAuth} >
        <button type="submit">Signin with Google</button>
      </form>
    </div>
  );
}