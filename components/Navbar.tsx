"use client";

import { useRouter } from "next/navigation";

export default function Navbar({ title }: { title: string }) {
  const router = useRouter();

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/login?role=admin");
  };

  return (
    <div className="bg-white shadow px-6 py-4 flex justify-between">
      <h1 className="text-xl font-bold">{title}</h1>

      <div className="flex gap-3">
        <button
          onClick={() => router.push("/")}
          className="bg-gray-200 px-3 py-1 rounded"
        >
          Back
        </button>

        <button
          onClick={logout}
          className="bg-red-500 text-white px-3 py-1 rounded"
        >
          Logout
        </button>
      </div>
    </div>
  );
}