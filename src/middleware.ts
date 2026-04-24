// src/middleware.ts
import { defineMiddleware } from "astro:middleware";
import { getSupabaseServerClient } from "@shared/lib/supabase";

/**
 * Prerendered (static) routes - these are generated at build time.
 * Middleware skips server-side operations for these routes to avoid
 * accessing Astro.request.headers during static generation.
 */
const prerenderedRoutes = new Set([
  "/",
  "/auth/login",
  "/auth/register",
  "/auth/verify-email",
]);

export const onRequest = defineMiddleware(async (context, next) => {
  const { url, locals, redirect, cookies } = context;

  // Skip middleware entirely for prerendered (static) routes
  if (prerenderedRoutes.has(url.pathname)) {
    return next();
  }

  // Initialize Supabase using cookies (only for SSR routes)
  const supabase = getSupabaseServerClient(cookies);
  locals.supabase = supabase;

  // Get user session
  const {
    data: { user },
  } = await supabase.auth.getUser();
  locals.user = user;

  // Bypass for Actions and image optimization
  if (
    url.pathname.startsWith("/_actions/") ||
    url.pathname.startsWith("/_image")
  ) {
    return next();
  }

  // Protect SSR routes - redirect unauthenticated users
  if (!user) {
    return redirect("/auth/login");
  }

  return next();
});