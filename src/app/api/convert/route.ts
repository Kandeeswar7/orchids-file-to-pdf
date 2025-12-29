import { NextRequest, NextResponse } from 'next/server';
import { JobQueue } from '@/lib/queue';
// DELETED: import { assertUserCanConvert } from '@/lib/firestore/users';
// DELETED: import { adminAuth } from '@/lib/firebase/admin';
import { Storage } from '@/lib/storage';

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || '';
    
    let inputPath = '';
    let fileName = 'document';
    let type = '';
    let options: any = {};
    
    // --- 1. STRICT AUTH CHECK REMOVED ---
    // The backend is now stateless and permission-agnostic.
    // Frontend handles all gating.
    let uid = '';
    let plan = 'free'; 
    let email = '';

    // NOTE: We keep these variables empty/default to pass to the queue
    // if strictly needed for typing, but they are meaningless now.

    const jobId = crypto.randomUUID();

    // --- 3. HANDLE INPUT & SAVE TO TEMP ---
    if (contentType.includes('multipart/form-data')) {
        const formData = await req.formData();
        const file = formData.get('file') as File;
        
        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }
        
        fileName = file.name;
        const ext = fileName.split('.').pop()?.toLowerCase() || '';
        
        // Determine Type
        if (['docx', 'doc'].includes(ext)) type = 'word';
        else if (['xlsx', 'xls', 'csv'].includes(ext)) type = 'excel';
        else if (['html', 'htm'].includes(ext)) type = 'html';
        else return NextResponse.json({ error: 'Unsupported file type' }, { status: 400 });

        // Options
        options.orientation = formData.get('orientation') || 'portrait';
        options.paperSize = formData.get('pageSize') || 'A4';
        if (type === 'excel') {
            options.gridlines = formData.get('gridlines') === 'true';
        }

        // WRITE TO DISK
        const buffer = Buffer.from(await file.arrayBuffer());
        inputPath = await Storage.saveInput(jobId, buffer, fileName);
        
    } else if (contentType.includes('application/json')) {
        const body = await req.json();
        if (!body.html) {
             return NextResponse.json({ error: 'No HTML content provided' }, { status: 400 });
        }
        type = 'html';
        fileName = body.filename || 'code.html';
        
        // Write HTML string to file
        const buffer = Buffer.from(body.html, 'utf-8');
        inputPath = await Storage.saveInput(jobId, buffer, fileName);
        
        options.orientation = 'portrait'; // Default for code
    } else {
        return NextResponse.json({ error: 'Unsupported Content-Type' }, { status: 400 });
    }

    const outputPath = Storage.getOutputPath(jobId);
    const priority = plan === 'premium' ? 100 : 10;

    console.log(`[API] Enqueuing Job ${jobId} (Type: ${type}) for User ${uid || 'Guest'} (Plan: ${plan})`);

    // --- 4. ENQUEUE WITH PATHS (NO CONTENT) ---
    await JobQueue.add({
        jobId,
        type,
        inputPath,
        outputPath,
        fileName,
        options,
        uid,
        plan
    }, priority, jobId);

    return NextResponse.json({ 
        jobId, 
        status: 'queued', 
        message: 'Conversion started' 
    });

  } catch (error: any) {
    console.error('[API] Conversion error:', error);
    return NextResponse.json({ error: error.message || 'Conversion failed' }, { status: 500 });
  }
}
