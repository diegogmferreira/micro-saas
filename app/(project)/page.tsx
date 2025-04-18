import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Galdev CRM',
  description: 'Landing page',
}


export default function Home() {
  return (
   <div className="flex flex-col items-center justify-center h-screen">
    <h1 className="text-4xl font-bold">Landing page</h1>
   </div>
  );
}
