import path from 'path';
import fs from 'fs';
import * as XLSX from 'xlsx';
import mammoth from 'mammoth';
import os from 'os';
import { getBrowser } from './browser';
import { PRINT_STYLES, EXCEL_STYLES } from './css-template';

// Use system temp directory for serverless compatibility
const TEMP_DIR = os.tmpdir();

interface ConvertOptions {
  orientation?: 'portrait' | 'landscape';
  paperSize?: 'A4' | 'Letter';
  gridlines?: boolean;
}

import { randomUUID } from 'crypto';

// Generate PDF from HTML using Puppeteer
async function generatePdfFromHtml(htmlContent: string, options: ConvertOptions): Promise<string> {
  const fileName = `${randomUUID()}.pdf`;
  const pdfFilePath = path.join(TEMP_DIR, fileName);

  console.log(`[Converter] Generating PDF: ${fileName}`);

  try {
    const browser = await getBrowser();
    const page = await browser.newPage();
    
    // High-fidelity A4 viewport (96 DPI)
    // Width: 210mm = 794px, Height: 297mm = 1123px
    const viewportWidth = 794;
    const viewportHeight = 1123;
    
    await page.setViewport({ 
      width: viewportWidth, 
      height: viewportHeight,
      deviceScaleFactor: 1, // Ensure 1:1 mapping
      isMobile: false,      // Prevent mobile emulation
      hasTouch: false
    });

    // CRITICAL: Emulate 'screen' media type to ensure what users see is what they get.
    // Default is 'print', which often hides backgrounds and changes margins.
    await page.emulateMediaType('screen');

    // Inject base print styles if not present
    const styles = `
      <style>
        ${PRINT_STYLES}
        ${options.orientation === 'landscape' ? '@page { size: landscape; }' : ''}
      </style>
    `;

    // Ensure we have a valid HTML structure
    let finalHtml = htmlContent;
    // Case-insensitive check for html tag
    if (!finalHtml.match(/<html/i)) {
        finalHtml = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                ${styles}
            </head>
            <body>
                <div class="document-container">
                    ${htmlContent}
                </div>
            </body>
            </html>
        `;
    } else {
        // Inject styles into existing head
        finalHtml = finalHtml.replace(/<\/head>/i, `${styles}</head>`);
    }

    // Relaxed wait condition since we check fonts/images manually
    await page.setContent(finalHtml, {
      waitUntil: 'domcontentloaded', 
      timeout: 60000 
    });

    // CRITICAL: Wait for fonts to be ready with timeout
    await page.evaluate(async () => {
       try {
         await Promise.race([
            document.fonts.ready,
            new Promise(resolve => setTimeout(resolve, 2000)) // 2s timeout for fonts
         ]);
       } catch (e) {
         console.warn('Font loading wait failed, proceeding anyway', e);
       }
    });

    // CRITICAL: Wait for all images to render with timeout
    await page.evaluate(async () => {
        const selectors = Array.from(document.querySelectorAll("img"));
        if (selectors.length === 0) return;
        
        await Promise.race([
            Promise.all(selectors.map(img => {
                if (img.complete) return;
                return new Promise((resolve) => {
                    img.onload = resolve;
                    img.onerror = resolve; // Don't fail the whole PDF if one image breaks
                });
            })),
            new Promise(resolve => setTimeout(resolve, 5000)) // 5s max wait for images
        ]);
    });

    const pdfOptions: any = {
      path: pdfFilePath,
      format: options.paperSize || 'A4',
      landscape: options.orientation === 'landscape',
      printBackground: true,
      margin: {
        top: '10mm',
        right: '10mm',
        bottom: '10mm',
        left: '10mm'
      },
      scale: 1,
      preferCSSPageSize: true // Respect @page rules
    };

    await page.pdf(pdfOptions);
    await page.close();

    console.log(`[Converter] PDF generated successfully: ${pdfFilePath}`);
    return fileName;
  } catch (error) {
    console.error('[Converter] Error generating PDF:', error);
    throw new Error(`PDF generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Convert Excel to PDF
export async function convertExcelToPdf(buffer: Buffer, options: ConvertOptions): Promise<string> {
  console.log('[Converter] Converting Excel to PDF...');
  
  try {
    // Parse Excel file
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Convert to HTML with styling
    const htmlTable = XLSX.utils.sheet_to_html(worksheet, {
      id: 'excel-table',
      editable: false
    });

    const finalHtml = `
      <div class="excel-wrapper">
        <h1 class="document-title">Excel Document - ${sheetName}</h1>
        <style>
          ${EXCEL_STYLES}
          .excel-wrapper { padding: 20px; }
          .document-title { font-size: 18pt; margin-bottom: 20px; color: #333; }
          td, th { border: ${options.gridlines ? '1px solid #bfbfbf' : 'none'}; }
        </style>
        ${htmlTable}
      </div>
    `;

    return await generatePdfFromHtml(finalHtml, options);
  } catch (error) {
    console.error('[Converter] Excel conversion error:', error);
    throw new Error(`Excel conversion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Convert HTML to PDF
export async function convertHtmlToPdf(htmlContent: string, options: ConvertOptions): Promise<string> {
  console.log('[Converter] Converting HTML to PDF...');
  
  try {
    // Sanitize HTML - remove potentially harmful content
    let cleanHtml = htmlContent
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');

    // The generatePdfFromHtml function will automatically wrap it with our master styles
    return await generatePdfFromHtml(cleanHtml, options);
  } catch (error) {
    console.error('[Converter] HTML conversion error:', error);
    throw new Error(`HTML conversion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Convert Word to PDF
export async function convertWordToPdf(buffer: Buffer, options: ConvertOptions): Promise<string> {
  console.log('[Converter] Converting Word to PDF...');
  
  try {
    // Convert DOCX to HTML
    const result = await mammoth.convertToHtml({ buffer });
    const html = result.value; 
    const messages = result.messages; 

    if (messages.length > 0) {
      console.log('[Converter] Word conversion messages:', messages);
    }

    const finalHtml = `
      <div class="word-content">
        ${html}
      </div>
    `;

    return await generatePdfFromHtml(finalHtml, options);
  } catch (error) {
    console.error('[Converter] Word conversion error:', error);
    throw new Error(`Word conversion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Check internet connectivity
async function checkInternetConnection(): Promise<boolean> {
  try {
    const response = await fetch('https://www.google.com', {
      method: 'HEAD',
      signal: AbortSignal.timeout(5000)
    });
    return response.ok;
  } catch {
    return false;
  }
}

// Convert URL to PDF (requires internet)
export async function convertUrlToPdf(url: string, options: ConvertOptions): Promise<string> {
  console.log(`[Converter] Converting URL to PDF: ${url}`);
  
  const isOnline = await checkInternetConnection();
  if (!isOnline) {
    throw new Error('Internet connection required for URL conversion.');
  }

  try {
    new URL(url);
  } catch {
    throw new Error('Invalid URL format.');
  }

  // Reuse the robust visual generation logic where possible, 
  // but for URLs we need to let the browser fetch the page first.
  // We'll reimplement the direct browser navigation here but share the PDF capture config.

  const fileName = `${randomUUID()}.pdf`;
  const pdfFilePath = path.join(TEMP_DIR, fileName);

  try {
    const browser = await getBrowser();
    const page = await browser.newPage();
    
    // Explicit high-res viewport
    await page.setViewport({ width: 1280, height: 1024, deviceScaleFactor: 1 });
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');

    console.log(`[Converter] Navigating to URL: ${url}`);
    
    await page.goto(url, {
      waitUntil: 'networkidle2',
      timeout: 60000 // Increased timeout for complex sites
    });

    // Clean up content
    await page.evaluate(() => {
      const selectorsToRemove = [
        '[class*="cookie"]', '[class*="gdpr"]', '[class*="banner"]',
        '[id*="cookie"]', '[class*="popup"]', '[class*="modal"]',
        'iframe[src*="ads"]', '[class*="advertisement"]'
      ];
      selectorsToRemove.forEach(s => document.querySelectorAll(s).forEach(el => el.remove()));
    });

    // Inject our print normalization to ensure consistent PDF output
    await page.addStyleTag({ content: PRINT_STYLES });
    
    // Also inject specific override for web pages to ensure they print reasonably well
    // REMOVED aggressive cleanup of header/footer/nav to preserve fidelity
    await page.addStyleTag({ content: `
      @media print {
        body { -webkit-print-color-adjust: exact; }
      }
    `});

    // Wait for fonts
    await page.evaluate(async () => {
       try { await document.fonts.ready; } catch (e) {}
    });

    const pdfOptions: any = {
      path: pdfFilePath,
      format: options.paperSize || 'A4',
      landscape: options.orientation === 'landscape',
      printBackground: true,
      margin: { top: '10mm', right: '10mm', bottom: '10mm', left: '10mm' },
      scale: 0.6 // Scale 1280px down to fit A4 (approx 794px printable width)
    };

    await page.pdf(pdfOptions);
    await page.close();

    console.log(`[Converter] URL PDF generated: ${pdfFilePath}`);
    return fileName;
  } catch (error) {
    console.error('[Converter] URL conversion error:', error);
    throw new Error(`URL conversion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

