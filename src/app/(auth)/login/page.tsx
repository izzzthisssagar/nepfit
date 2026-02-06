"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, Card } from "@/components/ui";
import { loginSchema, type LoginFormData } from "@/lib/validations/auth";
import { loginWithCredentials, loginWithGoogle } from "@/lib/actions/auth";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [loginMethod, setLoginMethod] = useState<"email" | "phone">("phone");
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setServerError("");
    setIsLoading(true);

    try {
      const result = await loginWithCredentials(data.identifier, data.password);

      if (result.success) {
        router.push("/dashboard");
        router.refresh();
      } else {
        setServerError(result.error || "Login failed");
      }
    } catch (error) {
      setServerError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (error) {
      setServerError("Google login failed");
    }
  };

  return (
    <Card className="w-full max-w-md" padding="xl" elevated>
      <div className="text-center mb-8">
        {/* Logo */}
        <div className="w-16 h-16 bg-primary-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <span className="text-white font-bold text-2xl">N</span>
        </div>
        <h1 className="text-2xl font-bold text-neutral-900 mb-2">
          Welcome Back
        </h1>
        <p className="text-neutral-500">
          Log in to continue your health journey
        </p>
      </div>

      {/* Demo Account Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
        <p className="text-sm text-blue-800 font-medium mb-1">Demo Account</p>
        <p className="text-xs text-blue-600">
          Email: demo@nepfit.com<br />
          Password: demo123
        </p>
      </div>

      {/* Login Method Toggle */}
      <div className="flex bg-neutral-100 rounded-xl p-1 mb-6">
        <button
          type="button"
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
            loginMethod === "phone"
              ? "bg-white text-neutral-900 shadow-sm"
              : "text-neutral-500"
          }`}
          onClick={() => {
            setLoginMethod("phone");
            setValue("identifier", "");
          }}
        >
          Phone
        </button>
        <button
          type="button"
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
            loginMethod === "email"
              ? "bg-white text-neutral-900 shadow-sm"
              : "text-neutral-500"
          }`}
          onClick={() => {
            setLoginMethod("email");
            setValue("identifier", "");
          }}
        >
          Email
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {loginMethod === "phone" ? (
          <Input
            label="Phone Number"
            type="tel"
            placeholder="+977 98XXXXXXXX"
            {...register("identifier")}
            error={errors.identifier?.message}
            leftIcon={
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
            }
          />
        ) : (
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            {...register("identifier")}
            error={errors.identifier?.message}
            leftIcon={
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            }
          />
        )}

        <Input
          label="Password"
          type="password"
          placeholder="Enter your password"
          {...register("password")}
          error={errors.password?.message}
          leftIcon={
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          }
        />

        {serverError && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
            {serverError}
          </div>
        )}

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-neutral-300 text-primary-500 focus:ring-primary-500"
            />
            <span className="text-neutral-600">Remember me</span>
          </label>
          <Link
            href="/forgot-password"
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            Forgot password?
          </Link>
        </div>

        <Button type="submit" fullWidth isLoading={isLoading} size="lg">
          Log In
        </Button>
      </form>

      {/* Social Login - Only show if Google OAuth is configured */}
      {/* Note: Google OAuth requires GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env.local */}
      {process.env.NEXT_PUBLIC_GOOGLE_ENABLED === "true" && (
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-neutral-500">
                Or continue with
              </span>
            </div>
          </div>

          <div className="mt-4">
            <Button
              variant="outline"
              className="w-full"
              onClick={handleGoogleLogin}
              type="button"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </Button>
          </div>
        </div>
      )}

      {/* Sign Up Link */}
      <p className="mt-8 text-center text-sm text-neutral-500">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="text-primary-600 hover:text-primary-700 font-medium"
        >
          Sign up free
        </Link>
      </p>
    </Card>
  );
}
