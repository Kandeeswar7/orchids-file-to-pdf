import path from 'path';
import fs from 'fs';
import puppeteer from 'puppeteer';
import * as XLSX from 'xlsx';

const TEMP_DIR = path.join(process.cwd(), 'public', 'temp');
if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

interface ConvertOptions {
  orientation?: 'portrait' | 'landscape';
  paperSize?: 'A4' | 'Letter';
  gridlines?: boolean;
}

// Singleton browser instance for better performance
let browserInstance: any = null;

async function getBrowser() {
  if (!browserInstance) {
    console.log('[Converter] Launching Puppeteer browser...');
    browserInstance = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });
  }
  return browserInstance;
}

// Generate PDF from HTML using Puppeteer
async function generatePdfFromHtml(html: string, options: ConvertOptions): Promise<string> {
  const fileName = `${crypto.randomUUID()}.pdf`;
  const pdfFilePath = path.join(TEMP_DIR, fileName);

  console.log(`[Converter] Generating PDF: ${fileName}`);

  try {
    const browser = await getBrowser();
    const page = await browser.newPage();
    
    await page.setContent(html, {
      waitUntil: 'networkidle0',
      timeout: 30000
    });

    const pdfOptions: any = {
      path: pdfFilePath,
      format: options.paperSize || 'A4',
      landscape: options.orientation === 'landscape',
      printBackground: true,
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px'
      }
    };

    await page.pdf(pdfOptions);
    await page.close();

    console.log(`[Converter] PDF generated successfully: ${pdfFilePath}`);
    return fileName; // Return just the filename, not the full path
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

    const styles = `
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body { 
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          padding: 20px;
          background: white;
        }
        h1 { 
          color: #2c3e50;
          margin-bottom: 20px;
          font-size: 24px;
        }
        table { 
          border-collapse: collapse;
          width: 100%;
          margin: 20px 0;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        td, th { 
          border: ${options.gridlines ? '1px solid #ddd' : 'none'};
          padding: 12px 16px;
          text-align: left;
          font-size: 14px;
        }
        th { 
          background-color: #3498db;
          color: white;
          font-weight: 600;
          text-transform: uppercase;
          font-size: 12px;
          letter-spacing: 0.5px;
        }
        tr:nth-child(even) {
          background-color: #f8f9fa;
        }
        tr:hover {
          background-color: #e8f4f8;
        }
      </style>
    `;

    const finalHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          ${styles}
        </head>
        <body>
          <h1>Excel Document - ${sheetName}</h1>
          ${htmlTable}
        </body>
      </html>
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

    // Wrap if not a complete document
    let finalHtml = cleanHtml;
    if (!finalHtml.toLowerCase().includes('<html')) {
      finalHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <style>
              body { 
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                padding: 30px;
                line-height: 1.8;
                color: #333;
                background: white;
              }
              h1, h2, h3 { margin-top: 24px; margin-bottom: 16px; }
              p { margin-bottom: 12px; }
              code { 
                background: #f4f4f4;
                padding: 2px 6px;
                border-radius: 3px;
                font-family: 'Courier New', monospace;
              }
              pre {
                background: #f4f4f4;
                padding: 16px;
                border-radius: 6px;
                overflow-x: auto;
                margin: 16px 0;
              }
            </style>
          </head>
          <body>${cleanHtml}</body>
        </html>
      `;
    }

    return await generatePdfFromHtml(finalHtml, options);
  } catch (error) {
    console.error('[Converter] HTML conversion error:', error);
    throw new Error(`HTML conversion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
  
  // Check internet connection first
  const isOnline = await checkInternetConnection();
  if (!isOnline) {
    throw new Error('Internet connection required for URL conversion. Please check your connection and try again.');
  }

  // Validate URL
  try {
    new URL(url);
  } catch {
    throw new Error('Invalid URL format. Please provide a valid website URL.');
  }

  const fileName = `${crypto.randomUUID()}.pdf`;
  const pdfFilePath = path.join(TEMP_DIR, fileName);

  try {
    const browser = await getBrowser();
    const page = await browser.newPage();
    
    // Set viewport and user agent
    await page.setViewport({ width: 1280, height: 800 });
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');

    console.log(`[Converter] Navigating to URL: ${url}`);
    
    // Navigate to URL with timeout
    await page.goto(url, {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    // Remove unnecessary elements for cleaner PDF
    await page.evaluate(() => {
      // Remove cookie banners, popups, ads
      const selectorsToRemove = [
        '[class*="cookie"]',
        '[class*="gdpr"]',
        '[class*="banner"]',
        '[id*="cookie"]',
        '[class*="popup"]',
        '[class*="modal"]',
        'iframe[src*="ads"]',
        '[class*="advertisement"]'
      ];
      
      selectorsToRemove.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => el.remove());
      });
    });

    const pdfOptions: any = {
      path: pdfFilePath,
      format: options.paperSize || 'A4',
      landscape: options.orientation === 'landscape',
      printBackground: true,
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px'
      }
    };

    await page.pdf(pdfOptions);
    await page.close();

    console.log(`[Converter] URL PDF generated successfully: ${pdfFilePath}`);
    return fileName;
  } catch (error) {
    console.error('[Converter] URL conversion error:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('timeout')) {
        throw new Error('Website took too long to load. Please try again or use a different URL.');
      }
      if (error.message.includes('net::ERR')) {
        throw new Error('Could not access the website. Please check the URL and your internet connection.');
      }
    }
    
    throw new Error(`URL conversion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

// Cleanup function to close browser when process exits
process.on('exit', async () => {
  if (browserInstance) {
    await browserInstance.close();
  }
});
