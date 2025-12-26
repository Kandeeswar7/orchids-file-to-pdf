import { NextRequest, NextResponse } from 'next/server';
import { JobQueue } from '@/lib/queue';
import { assertUserCanConvert } from '@/lib/firestore/users';
import { adminAuth } from '@/lib/firebase/admin';

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

    // 1. Auth & Usage Check
    const authHeader = req.headers.get('Authorization');
    let uid = '';
    let plan = 'free'; 
    let email = '';

    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split('Bearer ')[1];
        try {
            const decodedToken = await adminAuth.verifyIdToken(token);
            uid = decodedToken.uid;
            email = decodedToken.email || '';
        } catch (e) {
             console.warn("Invalid Token:", e);
             return NextResponse.json({ error: 'Invalid Authentication Token' }, { status: 401 });
        }
    }

    if (uid) {
        const check = await assertUserCanConvert(uid, email);
        if (!check.allowed) {
            return NextResponse.json({ error: check.reason }, { status: 403 });
        }
        plan = check.plan;
    } else {
        plan = 'guest';
    }

    // 2. Enqueue Job
    const jobId = crypto.randomUUID();
    const priority = plan === 'premium' ? 100 : 10;
    
    // Encode HTML string to base64 to pass safely through Queue
    const fileBase64 = Buffer.from(htmlContent).toString('base64');

    console.log(`[HTML] Enqueuing Job ${jobId} for User ${uid || 'Guest'} (Plan: ${plan})`);

    await JobQueue.add({
        jobId,
        type: 'html',
        fileContent: fileBase64,
        fileName: originalName,
        options: { orientation: 'portrait' }, // Default for HTML
        uid,
        plan
    }, priority);

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