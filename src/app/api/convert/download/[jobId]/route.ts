import { NextRequest, NextResponse } from 'next/server';
import { JobQueue } from '@/lib/queue';
import { Storage } from '@/lib/storage';
import * as fs from 'fs';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  const { jobId } = await params;
  
  const job = await JobQueue.get(jobId);
  if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  const state = await job.getState();
  if (state !== 'completed') {
      return NextResponse.json({ error: "Job not completed" }, { status: 400 });
  }

  // File serving from Shared Temp
  const filePath = Storage.getOutputPath(jobId);

  if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: "File expired or missing" }, { status: 404 });
  }

  const fileBuffer = fs.readFileSync(filePath);

  return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="converted-${jobId}.pdf"`,
      }
  });
}