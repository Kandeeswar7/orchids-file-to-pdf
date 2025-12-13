
import { NextRequest, NextResponse } from 'next/server';
import { JobQueue } from '@/lib/queue';
import { convertExcelToPdf } from '@/lib/converter';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const orientation = formData.get('orientation') as 'portrait' | 'landscape';
    const gridlines = formData.get('gridlines') === 'true';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const jobId = uuidv4();

    const job = JobQueue.create({
      id: jobId,
      type: 'excel',
      status: 'pending',
      progress: 0,
      createdAt: Date.now(),
      originalName: file.name
    });

    // Start processing in background
    (async () => {
      try {
        JobQueue.update(jobId, { status: 'processing', progress: 10 });
        const resultUrl = await convertExcelToPdf(buffer, { orientation, gridlines });
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
