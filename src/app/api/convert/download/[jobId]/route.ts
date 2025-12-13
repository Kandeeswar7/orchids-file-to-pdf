
import { NextRequest, NextResponse } from 'next/server';
import { JobQueue } from '@/lib/queue';
import fs from 'fs';
import path from 'path';

// Correctly typing the params for Next.js 15 App Router
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  const { jobId } = await params;
  const job = JobQueue.get(jobId);

  if (!job || !job.resultUrl) {
    return NextResponse.json({ error: 'File not ready' }, { status: 404 });
  }

  const filePath = path.join(process.cwd(), 'public', job.resultUrl);
  
  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: 'File not found on server' }, { status: 404 });
  }

  const fileBuffer = fs.readFileSync(filePath);

  return new NextResponse(fileBuffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="converted-${jobId}.pdf"`,
    },
  });
}
