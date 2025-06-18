"use client";

import Image from "next/image";
import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <div className="min-h-svh grid grid-cols-1 lg:grid-cols-2 gap-2">
      {/* Left Side - Logo */}
      <div className="flex items-center justify-end p-2 lg:pr-1">
        <div className="text-center">
          <Image
            src="/images/loginLogo.svg"
            alt="Arroz Paisa, Arriero Chino"
            width={655}
            height={822}
            className="w-80 h-auto md:w-96 lg:w-[500px] xl:w-[600px]"
            priority
          />
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex items-center justify-start p-2 lg:pl-1">
        <div className="w-full max-w-xs md:max-w-sm lg:max-w-[500px]">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
