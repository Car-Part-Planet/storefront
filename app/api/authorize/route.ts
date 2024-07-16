import { authorize, getOrigin } from 'lib/shopify/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest): Promise<NextResponse> {
  const origin = getOrigin(request);
  return await authorize(request, origin);
}
