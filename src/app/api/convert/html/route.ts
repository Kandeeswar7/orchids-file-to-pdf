import { NextRequest, NextResponse } from 'next/server';
import { JobQueue } from '@/lib/queue';
// DELETED: import { assertUserCanConvert } from '@/lib/firestore/users';
// DELETED: import { adminAuth } from '@/lib/firebase/admin';
import { Storage } from '@/lib/storage';

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || '';
    let htmlContent = '';
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

    // 1. Auth & Usage Check REMOVED
    let uid = '';
    let plan = 'free'; 
    let email = '';

    // 2. Enqueue Job
    const jobId = crypto.randomUUID();
    const priority = plan === 'premium' ? 100 : 10;
    
    // SAVE TO SAFE TEMP DIR
    const buffer = Buffer.from(htmlContent, 'utf-8');
    const inputPath = await Storage.saveInput(jobId, buffer, originalName);
    const outputPath = Storage.getOutputPath(jobId);

    console.log(`[HTML] Enqueuing Job ${jobId} for User ${uid || 'Guest'} (Plan: ${plan})`);

    await JobQueue.add({
        jobId,
        type: 'html',
        inputPath,
        outputPath,
        fileName: originalName,
        options: { orientation: 'portrait' },
        uid,
        plan
    }, priority, jobId);

    // 3. Return Job ID
    return NextResponse.json({ 
        jobId, 
        status: 'queued', 
        message: 'Conversion started' 
    });

  } catch (error: any) {
    console.error('[HTML] API error:', error);
    return NextResponse.json({ error: error.message || 'Conversion failed' }, { status: 500 });
  }
}