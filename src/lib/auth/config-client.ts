// Client-side config - exports whether Google OAuth is available
// This is set at build time

export const isGoogleOAuthEnabled = !!(
  process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
);
