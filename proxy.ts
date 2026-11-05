import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Javne rute: prijava, registracija, webhook-ovi prodavnica (provera potpisa u ruti)
// i cron (provera CRON_SECRET u ruti). Sve ostalo traži prijavu.
const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhook/(.*)",
  "/api/cron/(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Preskoči Next.js interne fajlove i statičke fajlove, osim ako su u query-ju
    "/((?!_next|[^?]*\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest|mp3|wav)).*)",
    // API rute uvek prolaze kroz proxy
    "/(api|trpc)(.*)",
  ],
};
