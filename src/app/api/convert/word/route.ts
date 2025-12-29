import { NextRequest, NextResponse } from 'next/server';
import { JobQueue } from '@/lib/queue';
// DELETED: import { assertUserCanConvert } from '@/lib/firestore/users';
// DELETED: import { adminAuth } from '@/lib/firebase/admin';
import { Storage } from '@/lib/storage';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const orientation = formData.get('orientation') as 'portrait' | 'landscape';
    const paperSize = formData.get('paperSize') as 'A4' | 'Letter';
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // 1. Auth & Usage Check REMOVED
    let uid = '';
    let plan = 'free'; 
    let email = '';

    // 2. Prepare Job Data
    const buffer = Buffer.from(await file.arrayBuffer());
    const jobId = crypto.randomUUID();
    
    // SAVE TO SAFE TEMP DIR
    const inputPath = await Storage.saveInput(jobId, buffer, file.name);
    const outputPath = Storage.getOutputPath(jobId);
    
    const priority = plan === 'premium' ? 100 : 10;

    console.log(`[API] Enqueuing Job ${jobId} for User ${uid || 'Guest'} (Plan: ${plan})`);

    await JobQueue.add({
        jobId,
        type: 'word',
        inputPath,  // Pass Path
        outputPath, // Pass Path
        fileName: file.name,
        options: { orientation, paperSize },
        uid,
        plan
    }, priority, jobId);

    // 3. Return Job ID immediately
    return NextResponse.json({ 
        jobId, 
        status: 'queued', 
        message: 'Conversion started' 
    });

  } catch (error: any) {
    console.error('[Word] API error:', error);
    return NextResponse.json({ error: error.message || 'Conversion failed' }, { status: 500 });
  }
}
