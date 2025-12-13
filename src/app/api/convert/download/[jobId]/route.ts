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
  console.log(`[Download] Request for job ${jobId}`);
  
  const job = JobQueue.get(jobId);

  if (!job || !job.resultUrl) {
    console.log(`[Download] Job ${jobId} not found or result not ready`);
    return NextResponse.json({ error: 'File not ready' }, { status: 404 });
  }

  const filePath = path.join(process.cwd(), 'public', job.resultUrl);
  console.log(`[Download] Looking for file at: ${filePath}`);
  
  if (!fs.existsSync(filePath)) {
    console.error(`[Download] File not found on disk: ${filePath}`);
    return NextResponse.json({ error: 'File not found on server' }, { status: 404 });
  }

  const fileBuffer = fs.readFileSync(filePath);
  const isHtml = filePath.endsWith('.html');
  
  console.log(`[Download] Serving file (${isHtml ? 'HTML' : 'PDF'}): ${filePath}, size: ${fileBuffer.length} bytes`);

  return new NextResponse(fileBuffer, {
    headers: {
      'Content-Type': isHtml ? 'text/html' : 'application/pdf',
      'Content-Disposition': `attachment; filename="converted-${jobId}.${isHtml ? 'html' : 'pdf'}"`,
    },
  });
}