"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const role = searchParams.get("role") || "admin"; // 🔒 default admin

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // 🚀 LOGIN FUNCTION
  const login = async () => {
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const json = await res.json();

      if (!res.ok) {
        alert(json.error || "Invalid credentials");
        return;
      }

      // ✅ SAVE TOKEN
      localStorage.setItem("token", json.token);

      alert("Login successful ✅");

      // 🔒 ONLY ADMIN LOGIN ALLOWED
      router.replace("/admin");

    } catch (err) {
      console.error(err);
      alert("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100 px-4">

      <div className="bg-white p-6 rounded-xl shadow w-full max-w-sm">

        {/* TITLE */}
        <h2 className="text-xl font-semibold text-center mb-5">
          🔐 Admin Login
        </h2>

        {/* EMAIL */}
        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 w-full mb-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* PASSWORD */}
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 w-full mb-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* BUTTON */}
        <button
          onClick={login}
          disabled={loading}
          className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* INFO */}
        <p className="text-xs text-gray-400 mt-4 text-center">
          Admin access only 🔒
        </p>

      </div>
    </div>
  );
}