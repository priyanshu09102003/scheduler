import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const protectedRoutes = createRouteMatcher([
    '/',
    '/upcoming',
    '/previous', 
    '/recordings',
    '/personal',
    '/meeting(.*)'
])

const publicRoutes = createRouteMatcher([
    '/sign-in(.*)',
    '/sign-up(.*)'
])

export default clerkMiddleware(async (auth, req) => {
    const { userId } = await auth()
    const isPublicRoute = publicRoutes(req)
    const isProtectedRoute = protectedRoutes(req)
    
    // If user is on a public route and already authenticated, redirect to home
    if (isPublicRoute && userId) {
        return NextResponse.redirect(new URL('/', req.url))
    }
    
    // If user is on a protected route and not authenticated, redirect to sign-in
    if (isProtectedRoute && !userId) {
        return NextResponse.redirect(new URL('/sign-in', req.url))
    }
    
    // Allow the request to proceed
    return NextResponse.next()
})

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
}