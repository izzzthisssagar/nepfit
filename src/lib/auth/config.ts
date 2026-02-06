import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

// For demo purposes - In production, use a proper database
const users: Array<{
  id: string;
  email: string;
  phone?: string;
  password: string;
  name: string;
}> = [
  {
    id: "1",
    email: "demo@nepfit.com",
    phone: "+9779800000000",
    password: "demo123", // In production, this should be hashed
    name: "Demo User",
  },
];

// Build providers array conditionally
const providers: NextAuthConfig["providers"] = [];

// Only add Google if credentials are configured
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  );
}

// Always add Credentials provider
providers.push(
  Credentials({
      name: "credentials",
      credentials: {
        identifier: { label: "Email or Phone", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.identifier || !credentials?.password) {
          return null;
        }

        const identifier = credentials.identifier as string;
        const password = credentials.password as string;

        // Find user by email or phone
        const user = users.find(
          (u) => u.email === identifier || u.phone === identifier
        );

        if (!user) {
          return null;
        }

        // In production, use bcrypt.compare()
        if (user.password !== password) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      },
    })
);

export const authConfig: NextAuthConfig = {
  providers,
  pages: {
    signIn: "/login",
    newUser: "/onboarding",
    error: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
      const isOnAuth =
        nextUrl.pathname.startsWith("/login") ||
        nextUrl.pathname.startsWith("/signup");

      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Redirect to login
      } else if (isOnAuth) {
        if (isLoggedIn) {
          return Response.redirect(new URL("/dashboard", nextUrl));
        }
      }
      return true;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET,
};

// Helper function to add a user (for signup)
export function addUser(user: {
  email?: string;
  phone?: string;
  password: string;
  name: string;
}) {
  const newUser = {
    id: String(users.length + 1),
    email: user.email ?? "",
    phone: user.phone,
    password: user.password, // In production, hash this!
    name: user.name,
  };
  users.push(newUser);
  return { id: newUser.id, email: newUser.email, name: newUser.name };
}

// Helper to find user
export function findUser(identifier: string) {
  return users.find((u) => u.email === identifier || u.phone === identifier);
}
