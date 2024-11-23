'use server';

import { NextRequest, NextResponse } from 'next/server';
import { checkSubscription } from './lib/checkSubscription';
import { getSession } from './lib/session';
import { authRoutes, DEFAULT_LOGIN_REDIRECT, publicRoute } from './routes';

export default async function middleware(req: NextRequest) {
  console.log('Middleware invoked');

  const session = await getSession();
  const user = session?.user;
  const isSubscribed = user ? await checkSubscription(user.id) : false;
  const nextUrl = req.nextUrl;
  const currentPath = nextUrl.pathname;

  const isPublicRoute = publicRoute.includes(currentPath);
  const isAuthRoute = authRoutes.includes(currentPath);

  if (!user) {
    if (!isPublicRoute && !isAuthRoute) {
      return redirectToIfDifferent('/SignIn', nextUrl);
    }
    if (currentPath === '/SignUp/planform') {
      return redirectToIfDifferent('/SignIn', nextUrl);
    }
    return NextResponse.next();
  }

  if (isSubscribed && (isAuthRoute || isPublicRoute)) {
    return redirectToIfDifferent(DEFAULT_LOGIN_REDIRECT, nextUrl);
  }

  if (!isSubscribed && !isPublicRoute && !isAuthRoute) {
    return redirectToIfDifferent('/SignUp/planform', nextUrl);
  }

  return NextResponse.next();
}

function redirectToIfDifferent(path: string, nextUrl: URL) {
  const url = new URL(path, nextUrl);
  return url.href !== nextUrl.href
    ? NextResponse.redirect(url)
    : NextResponse.next();
}

export const config = {
  matcher: ['/((?!.*\\.[\\w]+$|_next|api|trpc).*)'],
};
