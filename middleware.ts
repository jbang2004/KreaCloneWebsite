export { auth as middleware } from '@/auth';

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * - api/setup (database setup endpoint)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|api/setup|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
