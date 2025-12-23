import { NextRequest, NextResponse } from 'next/server';
import { convertWordToPdf } from '@/lib/converter';
import fs from 'fs';
import path from 'path';
import os from 'os';

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

    // Synchronous processing
    console.log(`[Word] Starting conversion for job ${jobId}`);
    const filename = await convertWordToPdf(buffer, { orientation, paperSize });
    console.log(`[Word] Conversion completed for job ${jobId}, filename: ${filename}`);

    const filePath = path.join(os.tmpdir(), filename);
    
    if (!fs.existsSync(filePath)) {
       throw new Error("Generated PDF file not found");
    }

    const fileBuffer = fs.readFileSync(filePath);
    
    // Clean up temp file immediately since we're serving it now
    try {
        fs.unlinkSync(filePath);
    } catch (e) {
        console.warn("Failed to cleanup temp file", e);
    }

    // Return the PDF file directly
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="converted.pdf"`,
        'X-Job-Id': jobId // Send Job ID in header for tracking if needed
      }
    });

  } catch (error: any) {
    console.error('[Word] API error:', error);
    return NextResponse.json({ error: error.message || 'Conversion failed' }, { status: 500 });
  }
}
