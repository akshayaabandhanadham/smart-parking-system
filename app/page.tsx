"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import RoleCard from "@/components/RoleCard";

export default function Home() {
  const router = useRouter();
  const [loadingRole, setLoadingRole] = useState<string | null>(null);

  const handleNavigate = (role: "user" | "admin") => {
    setLoadingRole(role);

    if (role === "user") {
      router.push("/user");
      return;
    }

    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("token")
        : null;

    if (!token) {
      router.push("/login?role=admin");
      return;
    }

    router.push("/admin");
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-4">
      <div className="bg-white p-8 md:p-10 rounded-2xl shadow-xl w-full max-w-md text-center">

        <h1 className="text-2xl md:text-3xl font-bold mb-2 text-gray-800">
          🚗 Smart Parking System
        </h1>

        <p className="text-gray-500 mb-8 text-sm md:text-base">
          Select your role to continue
        </p>

        <div className="space-y-4">

          <RoleCard
            title="User"
            description="Book parking slots"
            color="green"
            disabled={loadingRole !== null}
            loading={loadingRole === "user"}
            onClick={() => handleNavigate("user")}
          />

          <RoleCard
            title="Admin"
            description="Manage & analyze parking"
            color="blue"
            disabled={loadingRole !== null}
            loading={loadingRole === "admin"}
            onClick={() => handleNavigate("admin")}
          />

        </div>

        <p className="mt-6 text-xs text-gray-400">
          Built with Next.js • Tailwind CSS
        </p>

      </div>
    </main>
  );
}