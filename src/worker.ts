import { Worker } from 'bullmq';
import IORedis from 'ioredis';
import { convertWordToPdf, convertExcelToPdf, convertHtmlToPdf } from './lib/converter';
import * as fs from 'fs';
import * as path from 'path';
import { incrementUsage } from './lib/firestore/users';
// Relative import because this runs in ts-node context without path alias support by default
import { Storage } from './lib/storage';

const connection = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379', {
    maxRetriesPerRequest: null
});

console.log('[Worker] Starting conversion worker...');
console.log(`[Worker] Temp Root: ${Storage.getRootDir()}`);

const worker = new Worker('conversion-queue', async (job) => {
    console.log(`[Worker] Processing Job ${job.id} (Priority: ${job.opts.priority})`);
    
    let inputPath = '';

    try {
        const { type, inputPath: jobInputPath, outputPath, options, uid } = job.data;
        inputPath = jobInputPath; // For cleanup later
        
        let pdfFilename = '';

        // Read file from disk
        if (!fs.existsSync(inputPath)) {
            throw new Error(`Input file not found: ${inputPath}`);
        }
        
        // Read file to buffer for Mammoth/XLSX compatibility
        // (Memory efficient enough for <100MB files, if very large we'd stream but libraries need buffer)
        const fileBuffer = await fs.promises.readFile(inputPath);

        if (type === 'word') {
            pdfFilename = await convertWordToPdf(fileBuffer, options);
        } else if (type === 'excel') {
            pdfFilename = await convertExcelToPdf(fileBuffer, options);
        } else if (type === 'html') {
             const htmlString = fileBuffer.toString('utf-8');
             pdfFilename = await convertHtmlToPdf(htmlString, options);
        } else {
            throw new Error(`Unsupported job type: ${type}`);
        }

        // The converter creates a file in os.tmpdir() (variable name usually matches fileName)
        // We need to move it to the expected 'outputPath'
        // converter.ts returns just the filename, let's find where it put it.
        // It uses os.tmpdir() + filename.
        
        // NOTE: converter.ts logic assumes standard os.tmpdir(). 
        // We must ensure we look in the same place.
        // Ideally converter should accept an output directory, but we can't change it easily now?
        // Actually converter.ts: const TEMP_DIR = os.tmpdir();
        // So we look there.
        
        const generatedPath = path.join(require('os').tmpdir(), pdfFilename);
        
        if (fs.existsSync(generatedPath)) {
            // Move/Rename to the target output path (in our safe /converty-work dir)
            await fs.promises.rename(generatedPath, outputPath);
        } else {
             throw new Error(`Output file missing from converter at ${generatedPath}`);
        }

        // Cleanup Input
        try {
            if (fs.existsSync(inputPath)) {
                await fs.promises.unlink(inputPath);
            }
        } catch (e) {
            console.warn(`[Worker] Failed to cleanup input ${inputPath}`, e);
        }

        // Update Usage stats in Firestore
        if (uid) {
            await incrementUsage(uid);
        }
        
        return { status: 'completed', downloadUrl: `/api/convert/download/${job.id}` };

    } catch (error: any) {
        console.error(`[Worker] Job ${job.id} failed:`, error);
        
        // Try cleanup on fail
        try {
             if (inputPath && fs.existsSync(inputPath)) {
                 await fs.promises.unlink(inputPath);
             }
        } catch (e) { /* ignore */ }
        
        throw error;
    }

}, { 
    connection,
    concurrency: 5 // Process 5 jobs at once
});

worker.on('completed', (job) => {
    console.log(`[Worker] Job ${job.id} completed!`);
});

worker.on('failed', (job, err) => {
    console.error(`[Worker] Job ${job?.id || 'unknown'} failed with ${err.message}`);
});
