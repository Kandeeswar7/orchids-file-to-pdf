import { NextRequest, NextResponse } from 'next/server';
import { JobQueue } from '@/lib/queue';
import { assertUserCanConvert } from '@/lib/firestore/users';
import { adminAuth } from '@/lib/firebase/admin';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const orientation = formData.get('orientation') as 'portrait' | 'landscape';
    const gridlines = formData.get('gridlines') === 'true'; // Excel specific

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
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

    // 2. Prepare Job Data
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileBase64 = buffer.toString('base64');
    const jobId = crypto.randomUUID();
    const priority = plan === 'premium' ? 100 : 10;

    console.log(`[Excel] Enqueuing Job ${jobId} for User ${uid || 'Guest'} (Plan: ${plan})`);

    await JobQueue.add({
        jobId,
        type: 'excel',
        fileContent: fileBase64,
        fileName: file.name,
        options: { orientation, gridlines }, // Pass Excel options
        uid,
        plan
    }, priority);

    // 3. Return Job ID immediately
    return NextResponse.json({ 
        jobId, 
        status: 'queued', 
        message: 'Conversion started' 
    });

  } catch (error: any) {
    console.error('[Excel] API error:', error);
    return NextResponse.json({ error: error.message || 'Conversion failed' }, { status: 500 });
  }
}