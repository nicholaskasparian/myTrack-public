import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isProtectedRoute = createRouteMatcher([
  '/dashboard',
  '/generate',
  '/library',
  '/playlists',
  '/api/songs/(.*)',
  '/api/spotify/(.*)',
  '/api/generate/(.*)',
  '/api/playlists/(.*)',
])

export default clerkMiddleware((auth, request) => {
  // if (isProtectedRoute(request)) {
  //   auth().protect()
  // }
})

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
