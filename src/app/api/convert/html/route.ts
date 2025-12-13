import { NextRequest, NextResponse } from 'next/server';
import { JobQueue } from '@/lib/queue';
import { convertHtmlToPdf } from '@/lib/converter';

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || '';
    
    let htmlContent = '';
    let jobId = crypto.randomUUID();
    let originalName = 'document.html';

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file') as File;
      if (file) {
        htmlContent = await file.text();
        originalName = file.name;
      }
    } else {
      const body = await req.json();
      htmlContent = body.html;
      originalName = 'code.html';
    }

    if (!htmlContent) {
      return NextResponse.json({ error: 'No HTML content provided' }, { status: 400 });
    }

    console.log(`[HTML] Job created: ${jobId}, source: ${originalName}, length: ${htmlContent.length} chars`);

    JobQueue.create({
      id: jobId,
      type: htmlContent.length > 1000 ? 'html-file' : 'html-code',
      status: 'pending',
      progress: 0,
      createdAt: Date.now(),
      originalName
    });

    // Start processing
    (async () => {
      try {
        console.log(`[HTML] Starting conversion for job ${jobId}`);
        JobQueue.update(jobId, { status: 'processing', progress: 10 });
        
        const filename = await convertHtmlToPdf(htmlContent, { orientation: 'portrait' });
        
        console.log(`[HTML] Conversion completed for job ${jobId}, filename: ${filename}`);
        JobQueue.update(jobId, { status: 'completed', progress: 100, filename });
      } catch (error: any) {
        console.error(`[HTML] Conversion failed for job ${jobId}:`, error);
        JobQueue.update(jobId, { status: 'failed', error: error.message });
      }
    })();

    return NextResponse.json({ jobId });

  } catch (error) {
    console.error('[HTML] API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}