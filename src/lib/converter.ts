import path from 'path';
import fs from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

const TEMP_DIR = path.join(process.cwd(), 'public', 'temp');
if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

interface ConvertOptions {
  orientation?: 'portrait' | 'landscape';
  paperSize?: 'A4' | 'Letter';
  gridlines?: boolean;
}

// Simple HTML to PDF using browser print
async function generatePdfFromHtml(html: string, options: ConvertOptions): Promise<string> {
  const fileName = `${crypto.randomUUID()}.pdf`;
  const htmlFileName = `${crypto.randomUUID()}.html`;
  const htmlFilePath = path.join(TEMP_DIR, htmlFileName);
  const pdfFilePath = path.join(TEMP_DIR, fileName);

  console.log(`[Converter] Generating PDF: ${fileName}`);
  console.log(`[Converter] Temp HTML path: ${htmlFilePath}`);

  // Write HTML to temp file
  fs.writeFileSync(htmlFilePath, html);

  try {
    // Try to use wkhtmltopdf if available, otherwise fall back to basic HTML response
    try {
      const orientation = options.orientation || 'portrait';
      const pageSize = options.paperSize || 'A4';
      
      await execPromise(
        `wkhtmltopdf --orientation ${orientation} --page-size ${pageSize} "${htmlFilePath}" "${pdfFilePath}"`
      );
      console.log(`[Converter] wkhtmltopdf conversion successful: ${pdfFilePath}`);
    } catch (error) {
      console.log('[Converter] wkhtmltopdf not available, using fallback HTML method');
      
      // Fallback: Create a simple PDF placeholder that explains conversion needs external tools
      const fallbackHtml = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: 'Arial', sans-serif;
      padding: 40px;
      max-width: 800px;
      margin: 0 auto;
    }
    .content {
      border: 2px solid #333;
      padding: 20px;
      margin: 20px 0;
    }
    h1 { color: #333; }
    pre {
      background: #f4f4f4;
      padding: 15px;
      border-radius: 5px;
      overflow-x: auto;
    }
  </style>
</head>
<body>
  <h1>Conversion Preview</h1>
  <div class="content">
    ${html}
  </div>
  <p><small>Note: This is a preview. For full PDF conversion, install wkhtmltopdf or puppeteer.</small></p>
</body>
</html>`;
      
      const fallbackPath = pdfFilePath.replace('.pdf', '.html');
      fs.writeFileSync(fallbackPath, fallbackHtml);
      console.log(`[Converter] Fallback HTML saved: ${fallbackPath}`);
      // For now, return HTML file as "PDF"
      fs.unlinkSync(htmlFilePath);
      return `/temp/${fileName.replace('.pdf', '.html')}`;
    }

    // Clean up temp HTML file
    fs.unlinkSync(htmlFilePath);
    console.log(`[Converter] PDF generation complete, result URL: /temp/${fileName}`);
    return `/temp/${fileName}`;
  } catch (error) {
    // Clean up on error
    if (fs.existsSync(htmlFilePath)) {
      fs.unlinkSync(htmlFilePath);
    }
    console.error('[Converter] Error during PDF generation:', error);
    throw error;
  }
}

export async function convertExcelToPdf(buffer: Buffer, options: ConvertOptions): Promise<string> {
  // For now, create a simple HTML table representation
  // In production, you'd want to use xlsx package here
  const htmlTable = `
    <table border="${options.gridlines ? '1' : '0'}">
      <tr><th>Data Preview</th></tr>
      <tr><td>Excel file received: ${buffer.length} bytes</td></tr>
      <tr><td>Install 'xlsx' package for full Excel parsing</td></tr>
    </table>
  `;

  const styles = `
    <style>
      body { font-family: sans-serif; padding: 20px; }
      table { border-collapse: collapse; width: 100%; margin: 20px 0; }
      td, th { border: ${options.gridlines ? '1px solid #ccc' : 'none'}; padding: 12px; text-align: left; }
      th { background-color: #f4f4f4; font-weight: bold; }
      h1 { color: #333; }
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
        <h1>Excel Document</h1>
        ${htmlTable}
      </body>
    </html>
  `;

  return await generatePdfFromHtml(finalHtml, options);
}

export async function convertHtmlToPdf(htmlContent: string, options: ConvertOptions): Promise<string> {
  // Basic HTML sanitization (remove script tags)
  let cleanHtml = htmlContent
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');

  // Wrap if not complete document
  let finalHtml = cleanHtml;
  if (!finalHtml.includes('<html')) {
    finalHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { 
              font-family: sans-serif; 
              padding: 20px;
              line-height: 1.6;
            }
          </style>
        </head>
        <body>${cleanHtml}</body>
      </html>
    `;
  }

  return await generatePdfFromHtml(finalHtml, options);
}

export async function convertUrlToPdf(url: string, options: ConvertOptions): Promise<string> {
  // URL conversion requires internet access
  // This is a placeholder implementation
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body {
            font-family: sans-serif;
            padding: 40px;
            max-width: 800px;
            margin: 0 auto;
          }
          .url-box {
            background: #f0f0f0;
            padding: 15px;
            border-radius: 5px;
            margin: 20px 0;
          }
        </style>
      </head>
      <body>
        <h1>URL Conversion Request</h1>
        <div class="url-box">
          <strong>URL:</strong> ${url}
        </div>
        <p>URL conversion requires internet access and puppeteer.</p>
        <p>Install puppeteer to enable full URL-to-PDF conversion.</p>
      </body>
    </html>
  `;

  return await generatePdfFromHtml(html, options);
}