import { NextRequest, NextResponse } from 'next/server';
import { JobQueue } from '@/lib/queue';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  const { jobId } = await params;
  
  if (!jobId) {
      return NextResponse.json({ error: "Missing Job ID" }, { status: 400 });
  }

  const job = await JobQueue.get(jobId);

  if (!job) {
    return NextResponse.json({ error: 'Job not found' }, { status: 404 });
  }

  const state = await job.getState();
  const result = job.returnvalue;
  const progress = job.progress;

  return NextResponse.json({
      id: job.id,
      state,
      progress,
      result
  });
}
