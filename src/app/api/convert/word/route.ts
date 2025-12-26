import { NextRequest, NextResponse } from 'next/server';
import { JobQueue } from '@/lib/queue';
import { assertUserCanConvert } from '@/lib/firestore/users';
import { adminAuth } from '@/lib/firebase/admin';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const orientation = formData.get('orientation') as 'portrait' | 'landscape';
    const paperSize = formData.get('paperSize') as 'A4' | 'Letter';
    
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
             // STRICT RULE: If header exists but invalid -> Reject
             return NextResponse.json({ error: 'Invalid Authentication Token' }, { status: 401 });
        }
    }

    // Call strict assertion logic
    // Guests (no uid) might be allowed with limited features or blocked depending on policy.
    // Plan says "Guest users can convert (limited)".
    // assertUserCanConvert handles empty uid by returning "guest" plan and maybe false allowed if we want to block.
    // Let's modify assertUserCanConvert to handle guest logic if we desire, OR handle it here.
    // For now, if no UID, we treat as guest.
    
    if (uid) {
        const check = await assertUserCanConvert(uid, email);
        if (!check.allowed) {
            return NextResponse.json({ error: check.reason }, { status: 403 });
        }
        plan = check.plan;
    } else {
        // Guest Logic (Limit by IP not possible easily without storage/cache, so just allow for now or strict block?)
        // User request says: "Guest users can convert (limited)"
        // We'll tag as 'guest' plan.
        plan = 'guest';
    }

    // 2. Prepare Job Data
    // We need to pass the file content. 
    // WARNING: Passing large buffers to Redis is bad practice. 
    // Ideally, upload to Storage (Firebase/S3) and pass URL.
    // For this "Offline/Local-ish" task without bucket, we might store to temp disk and pass PATH,
    // assuming Worker and API share filesystem (Local dev / container).
    // If separate machines, Redis is the only bridge, so Buffer encoded as Base64 is necessary (but limits size).
    
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Convert to base64 for Redis safety (simpler than file sharing for now)
    const fileBase64 = buffer.toString('base64');
    
    const jobId = crypto.randomUUID();
    const priority = plan === 'premium' ? 100 : 10;

    console.log(`[API] Enqueuing Job ${jobId} for User ${uid || 'Guest'} (Plan: ${plan})`);

    await JobQueue.add({
        jobId,
        type: 'word',
        fileContent: fileBase64, // Pass Data
        fileName: file.name,
        options: { orientation, paperSize },
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
    console.error('[Word] API error:', error);
    return NextResponse.json({ error: error.message || 'Conversion failed' }, { status: 500 });
  }
}
