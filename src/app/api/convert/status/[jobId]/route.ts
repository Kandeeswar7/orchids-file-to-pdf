
import { NextRequest, NextResponse } from 'next/server';
import { JobQueue } from '@/lib/queue';

// Correctly typing the params for Next.js 15 App Router
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  const { jobId } = await params;
  const job = JobQueue.get(jobId);

  if (!job) {
    return NextResponse.json({ error: 'Job not found' }, { status: 404 });
  }

  return NextResponse.json(job);
}
