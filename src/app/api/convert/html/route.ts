
import { NextRequest, NextResponse } from 'next/server';
import { JobQueue } from '@/lib/queue';
import { convertHtmlToPdf } from '@/lib/converter';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || '';
    
    let htmlContent = '';
    let jobId = uuidv4();
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

    const job = JobQueue.create({
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
        JobQueue.update(jobId, { status: 'processing', progress: 10 });
        const resultUrl = await convertHtmlToPdf(htmlContent, { orientation: 'portrait' }); // Default options
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
