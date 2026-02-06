"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input, Card } from "@/components/ui";
import { signupSchema, type SignupFormData } from "@/lib/validations/auth";
import { signup, loginWithGoogle } from "@/lib/actions/auth";

export default function SignupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [signupMethod, setSignupMethod] = useState<"email" | "phone">("phone");
  const [step, setStep] = useState(1);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    getValues,
    setValue,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleNext = async () => {
    const isValid = await trigger(["firstName", "lastName", signupMethod === "email" ? "email" : "phone"]);
    if (isValid) {
      setStep(2);
    }
  };

  const onSubmit = async (data: SignupFormData) => {
    setServerError("");
    setIsLoading(true);

    try {
      const result = await signup({
        firstName: data.firstName,
        lastName: data.lastName,
        email: signupMethod === "email" ? data.email : undefined,
        phone: signupMethod === "phone" ? data.phone : undefined,
        password: data.password,
      });

      if (result.success) {
        router.push("/onboarding");
        router.refresh();
      } else {
        setServerError(result.error || "Signup failed");
      }
    } catch (error) {
      setServerError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      await loginWithGoogle();
    } catch (error) {
      setServerError("Google signup failed");
    }
  };

  return (
    <Card className="w-full max-w-md" padding="lg">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-neutral-900 mb-2">
          Create Your Account
        </h1>
        <p className="text-neutral-500">
          Start your journey to better health today
        </p>
      </div>

      {/* Progress Indicator */}
      <div className="flex items-center justify-center gap-2 mb-8">
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            step >= 1 ? "bg-primary-500 text-white" : "bg-neutral-200 text-neutral-500"
          }`}
        >
          1
        </div>
        <div className="w-12 h-1 bg-neutral-200 rounded overflow-hidden">
          <div
            className={`h-full bg-primary-500 rounded transition-all duration-300 ${
              step >= 2 ? "w-full" : "w-0"
            }`}
          />
        </div>
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            step >= 2 ? "bg-primary-500 text-white" : "bg-neutral-200 text-neutral-500"
          }`}
        >
          2
        </div>
      </div>

      {step === 1 && (
        <div className="space-y-4">
          {/* Signup Method Toggle */}
          <div className="flex bg-neutral-100 rounded-xl p-1 mb-4">
            <button
              type="button"
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                signupMethod === "phone"
                  ? "bg-white text-neutral-900 shadow-sm"
                  : "text-neutral-500"
              }`}
              onClick={() => {
                setSignupMethod("phone");
                setValue("email", "");
              }}
            >
              Phone
            </button>
            <button
              type="button"
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                signupMethod === "email"
                  ? "bg-white text-neutral-900 shadow-sm"
                  : "text-neutral-500"
              }`}
              onClick={() => {
                setSignupMethod("email");
                setValue("phone", "");
              }}
            >
              Email
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="First Name"
              placeholder="John"
              {...register("firstName")}
              error={errors.firstName?.message}
            />
            <Input
              label="Last Name"
              placeholder="Doe"
              {...register("lastName")}
              error={errors.lastName?.message}
            />
          </div>

          {signupMethod === "phone" ? (
            <Input
              label="Phone Number"
              type="tel"
              placeholder="+977 98XXXXXXXX"
              {...register("phone")}
              error={errors.phone?.message}
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
              {...register("email")}
              error={errors.email?.message}
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

          <Button type="button" onClick={handleNext} fullWidth size="lg">
            Continue
          </Button>
        </div>
      )}

      {step === 2 && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Password"
            type="password"
            placeholder="Create a strong password"
            {...register("password")}
            error={errors.password?.message}
            hint="At least 8 characters with uppercase, lowercase, and number"
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

          <Input
            label="Confirm Password"
            type="password"
            placeholder="Confirm your password"
            {...register("confirmPassword")}
            error={errors.confirmPassword?.message}
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

          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              id="terms"
              className="mt-1 w-4 h-4 rounded border-neutral-300 text-primary-500 focus:ring-primary-500"
              required
            />
            <label htmlFor="terms" className="text-sm text-neutral-600">
              I agree to the{" "}
              <Link
                href="/terms"
                className="text-primary-600 hover:text-primary-700"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="text-primary-600 hover:text-primary-700"
              >
                Privacy Policy
              </Link>
            </label>
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep(1)}
              className="flex-1"
            >
              Back
            </Button>
            <Button type="submit" isLoading={isLoading} className="flex-1">
              Create Account
            </Button>
          </div>
        </form>
      )}

      {/* Social Signup - Only show if Google OAuth is configured */}
      {process.env.NEXT_PUBLIC_GOOGLE_ENABLED === "true" && (
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-neutral-500">
                Or sign up with
              </span>
            </div>
          </div>

          <div className="mt-4">
            <Button
              variant="outline"
              className="w-full"
              onClick={handleGoogleSignup}
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

      {/* Login Link */}
      <p className="mt-8 text-center text-sm text-neutral-500">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-primary-600 hover:text-primary-700 font-medium"
        >
          Log in
        </Link>
      </p>
    </Card>
  );
}
