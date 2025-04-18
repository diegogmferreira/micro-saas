import { handleAuth } from "@/app/actions/authenticate";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Dashboard',
}

export default function Dashboard() {
  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-10">
      <h1 className="text-4xl font-bold">Protected Dashboard</h1>

      <button onClick={handleAuth}>Sign out</button>

      <Link 
      href="/payment"
      className="bg-amber-500 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded"
      >
        Pagamentos
        </Link>
    </div>
  );
}