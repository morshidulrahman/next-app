"use client";
import RegisterComponent from "@/components/Auth/RegisterComponent";
import { Suspense } from "react";

export default function RegisterPage() {
  return (
    <Suspense fallback={<div />}>
      <RegisterComponent />
    </Suspense>
  );
}
