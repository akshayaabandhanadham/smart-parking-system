"use client";

import { Suspense } from "react";
import LoginPage from "./LoginPage";

export default function Page() {
  return (
    <Suspense fallback={<p className="p-6">Loading...</p>}>
      <LoginPage />
    </Suspense>
  );
}