
import { NextRequest, NextResponse } from 'next/server';
import { JobQueue } from '@/lib/queue';
import { convertUrlToPdf } from '@/lib/converter';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json({ error: 'No URL provided' }, { status: 400 });
    }

    const jobId = uuidv4();

    const job = JobQueue.create({
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
        JobQueue.update(jobId, { status: 'processing', progress: 10 });
        const resultUrl = await convertUrlToPdf(url, { orientation: 'portrait' });
        JobQueue.update(jobId, { status: 'completed', progress: 100, resultUrl });
      } catch (error: any) {
        console.error('Conversion failed:', error);
        JobQueue.update(jobId, { status: 'failed', error: error.message });
      }
    })();

    return NextResponse.json({ jobId });

  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
