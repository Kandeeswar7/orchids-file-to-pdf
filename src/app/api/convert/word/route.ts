import { NextRequest, NextResponse } from 'next/server';
import { JobQueue } from '@/lib/queue';
import { convertWordToPdf } from '@/lib/converter';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const orientation = formData.get('orientation') as 'portrait' | 'landscape';
    const paperSize = formData.get('paperSize') as 'A4' | 'Letter';
    
    // Support doc/docx (though mammoth mainly does docx, we'll try)
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const jobId = crypto.randomUUID();

    console.log(`[Word] Job created: ${jobId}, file: ${file.name}, size: ${buffer.length} bytes`);

    JobQueue.create({
      id: jobId,
      type: 'word',
      status: 'pending',
      progress: 0,
      createdAt: Date.now(),
      originalName: file.name
    });

    // Start processing in background
    (async () => {
      try {
        console.log(`[Word] Starting conversion for job ${jobId}`);
        JobQueue.update(jobId, { status: 'processing', progress: 10 });
        
        const filename = await convertWordToPdf(buffer, { orientation, paperSize });
        
        console.log(`[Word] Conversion completed for job ${jobId}, filename: ${filename}`);
        JobQueue.update(jobId, { status: 'completed', progress: 100, filename });
      } catch (error: any) {
        console.error(`[Word] Conversion failed for job ${jobId}:`, error);
        JobQueue.update(jobId, { status: 'failed', error: error.message });
      }
    })();

    return NextResponse.json({ jobId });
  } catch (error) {
    console.error('[Word] API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
