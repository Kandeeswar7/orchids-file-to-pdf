import { NextRequest, NextResponse } from 'next/server';
import { convertUrlToPdf } from '@/lib/converter';
import fs from 'fs';
import path from 'path';
import os from 'os';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json({ error: 'No URL provided' }, { status: 400 });
    }

    const jobId = crypto.randomUUID();

    console.log(`[URL] Job created: ${jobId}, url: ${url}`);

    // Synchronous processing
    console.log(`[URL] Starting conversion for job ${jobId}`);
    const filename = await convertUrlToPdf(url, { orientation: 'portrait' });
    console.log(`[URL] Conversion completed for job ${jobId}, filename: ${filename}`);

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
        'Content-Disposition': `attachment; filename="website.pdf"`,
        'X-Job-Id': jobId
      }
    });

  } catch (error: any) {
    console.error('[URL] API error:', error);
    return NextResponse.json({ error: error.message || 'Conversion failed' }, { status: 500 });
  }
}