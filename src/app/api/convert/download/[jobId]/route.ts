import { NextRequest, NextResponse } from 'next/server';
import { JobQueue } from '@/lib/queue';
import fs from 'fs';
import path from 'path';
import os from 'os';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  const { jobId } = await params;
  console.log(`[Download] Request for job ${jobId}`);
  
  const job = JobQueue.get(jobId);

  if (!job) {
    console.log(`[Download] Job ${jobId} not found`);
    return NextResponse.json({ error: 'Job not found' }, { status: 404 });
  }

  if (job.status !== 'completed' || !job.filename) {
    console.log(`[Download] Job ${jobId} not ready (status: ${job.status})`);
    return NextResponse.json({ error: 'File not ready or conversion failed' }, { status: 404 });
  }

  const filePath = path.join(os.tmpdir(), job.filename);
  console.log(`[Download] Looking for file at: ${filePath}`);
  
  if (!fs.existsSync(filePath)) {
    console.error(`[Download] File not found on disk: ${filePath}`);
    return NextResponse.json({ error: 'PDF file not found on server' }, { status: 404 });
  }

  const fileBuffer = fs.readFileSync(filePath);
  const fileName = `converted-${job.originalName || 'document'}.pdf`.replace(/\.(xlsx?|html?|htm)$/i, '.pdf');
  
  console.log(`[Download] Serving PDF: ${filePath}, size: ${fileBuffer.length} bytes`);

  return new NextResponse(fileBuffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${fileName}"`,
      'Content-Length': fileBuffer.length.toString(),
    },
  });
}