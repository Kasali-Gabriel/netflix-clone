'use server';

import { jwtVerify, SignJWT } from 'jose';
import { cookies } from 'next/headers';

export type Session = {
  user: { id: string; email: string };
  accessToken: string;
  refreshToken: string;
};

const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY!;
const encodedKey = new TextEncoder().encode(secretKey);

export async function createSession(payload: Session) {
  const expiredAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);
  const session = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(encodedKey);

  cookies().set('session', session, {
    expires: expiredAt,
    httpOnly: true,
    sameSite: 'lax',
    secure: true,
    path: '/',
  });
}

export async function getSession() {
  const cookie = cookies().get('session')?.value;
  if (!cookie) return null;

  const { payload } = await jwtVerify(cookie, encodedKey, {
    algorithms: ['HS256'],
  });

  return payload as Session;
}

export async function deleteSession() {
  cookies().delete('session');
}
