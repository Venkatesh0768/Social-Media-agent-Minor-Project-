import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Define the routes that are accessible without protection.
const publicRoutes = [
  '/',
  '/api/clerk-webhook',
  '/api/drive-activity/notification',
  '/api/payment/success',
  '/sign-in(.*)', // example of a custom public route (regex supported)
];

// Create a matcher function for public routes.
const isPublicRoute = createRouteMatcher(publicRoutes);

// Define routes to completely ignore the middleware.
const ignoredRoutes = [
  '/api/auth/callback/discord',
  '/api/auth/callback/notion',
  '/api/auth/callback/slack',
  '/api/flow',
  '/api/cron/wait',
];

export default clerkMiddleware(async (auth, request) => {
  const { pathname } = request.nextUrl;

  // Bypass middleware for ignored routes
  if (ignoredRoutes.some((route) => pathname.startsWith(route))) {
    return;
  }

  // For routes not marked as public, enforce protection
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

// The matcher below determines which requests the middleware will run on.
export const config = {
  matcher: [
    // Skip Next.js internals and static files unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API and tRPC routes
    '/(api|trpc)(.*)',
  ],
};
