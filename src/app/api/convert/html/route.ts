import { NextRequest, NextResponse } from 'next/server';
import { convertHtmlToPdf } from '@/lib/converter';
import fs from 'fs';
import path from 'path';
import os from 'os';

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

    // Synchronous processing
    console.log(`[HTML] Starting conversion for job ${jobId}`);
    const filename = await convertHtmlToPdf(htmlContent, { orientation: 'portrait' });
    console.log(`[HTML] Conversion completed for job ${jobId}, filename: ${filename}`);

    const filePath = path.join(os.tmpdir(), filename);

    if (!fs.existsSync(filePath)) {
       throw new Error("Generated PDF file not found");
    }

    const fileBuffer = fs.readFileSync(filePath);
    
    // Clean up temp file
    try {
        fs.unlinkSync(filePath);
    } catch (e) {
        console.warn("Failed to cleanup temp file", e);
    }

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="document.pdf"`,
        'X-Job-Id': jobId
      }
    });

  } catch (error: any) {
    console.error('[HTML] API error:', error);
    return NextResponse.json({ error: error.message || 'Conversion failed' }, { status: 500 });
  }
}