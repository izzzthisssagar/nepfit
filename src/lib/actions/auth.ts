"use server";

import { signIn, signOut } from "@/lib/auth";
import { addUser, findUser } from "@/lib/auth/config";
import { AuthError } from "next-auth";

export async function loginWithCredentials(
  identifier: string,
  password: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await signIn("credentials", {
      identifier,
      password,
      redirect: false,
    });
    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { success: false, error: "Invalid email/phone or password" };
        default:
          return { success: false, error: "Something went wrong" };
      }
    }
    throw error;
  }
}

export async function loginWithGoogle() {
  await signIn("google", { redirectTo: "/dashboard" });
}

export async function signup(data: {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  password: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    // Check if user already exists
    const identifier = data.email || data.phone || "";
    const existingUser = findUser(identifier);

    if (existingUser) {
      return {
        success: false,
        error: "An account with this email/phone already exists",
      };
    }

    // Create new user
    const newUser = addUser({
      email: data.email,
      phone: data.phone,
      password: data.password,
      name: `${data.firstName} ${data.lastName}`,
    });

    // Auto sign in after signup
    await signIn("credentials", {
      identifier: data.email || data.phone,
      password: data.password,
      redirect: false,
    });

    return { success: true };
  } catch (error) {
    console.error("Signup error:", error);
    return { success: false, error: "Failed to create account" };
  }
}

export async function logout() {
  await signOut({ redirectTo: "/" });
}
