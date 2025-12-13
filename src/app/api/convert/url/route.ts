import { NextRequest, NextResponse } from 'next/server';
import { JobQueue } from '@/lib/queue';
import { convertUrlToPdf } from '@/lib/converter';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json({ error: 'No URL provided' }, { status: 400 });
    }

    const jobId = crypto.randomUUID();

    console.log(`[URL] Job created: ${jobId}, url: ${url}`);

    JobQueue.create({
      id: jobId,
      type: 'url',
      status: 'pending',
      progress: 0,
      createdAt: Date.now(),
      originalName: url
    });

    // Start processing
    (async () => {
      try {
        console.log(`[URL] Starting conversion for job ${jobId}`);
        JobQueue.update(jobId, { status: 'processing', progress: 10 });
        
        const filename = await convertUrlToPdf(url, { orientation: 'portrait' });
        
        console.log(`[URL] Conversion completed for job ${jobId}, filename: ${filename}`);
        JobQueue.update(jobId, { status: 'completed', progress: 100, filename });
      } catch (error: any) {
        console.error(`[URL] Conversion failed for job ${jobId}:`, error);
        JobQueue.update(jobId, { status: 'failed', error: error.message });
      }
    })();

    return NextResponse.json({ jobId });

  } catch (error) {
    console.error('[URL] API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}