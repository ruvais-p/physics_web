import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: 'Successfully logged out',
  });

  // Clear all auth token cookies
  response.cookies.set('auth_token', '', {
    httpOnly: true,
    expires: new Date(0),
    path: '/',
  });
  response.cookies.set('admin_token', '', {
    httpOnly: true,
    expires: new Date(0),
    path: '/',
  });
  response.cookies.set('faculty_token', '', {
    httpOnly: true,
    expires: new Date(0),
    path: '/',
  });

  return response;
}
