
import puppeteer from 'puppeteer';
import * as XLSX from 'xlsx';
import createDOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';
import { Readability } from '@mozilla/readability';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window as any);

const TEMP_DIR = path.join(process.cwd(), 'public', 'temp');
if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

interface ConvertOptions {
  orientation?: 'portrait' | 'landscape';
  paperSize?: 'A4' | 'Letter';
  gridlines?: boolean;
}

export async function convertExcelToPdf(buffer: Buffer, options: ConvertOptions): Promise<string> {
  // 1. Parse Excel
  const workbook = XLSX.read(buffer, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];

  // 2. Convert to HTML
  const htmlTable = XLSX.utils.sheet_to_html(worksheet);

  // 3. Style and Wrap HTML
  const styles = `
    <style>
      body { font-family: sans-serif; padding: 20px; }
      table { border-collapse: collapse; width: 100%; }
      td, th { border: ${options.gridlines ? '1px solid #ccc' : 'none'}; padding: 8px; text-align: left; }
      th { background-color: #f4f4f4; font-weight: bold; }
      /* AI Optimization: improved typography */
      h1 { color: #333; }
    </style>
  `;

  const finalHtml = `
    <!DOCTYPE html>
    <html>
      <head>${styles}</head>
      <body>
        <h1>${sheetName}</h1>
        ${htmlTable}
      </body>
    </html>
  `;

  // 4. Generate PDF
  return await generatePdfFromHtml(finalHtml, options);
}

export async function convertHtmlToPdf(htmlContent: string, options: ConvertOptions): Promise<string> {
  // 1. Sanitize HTML
  const cleanHtml = DOMPurify.sanitize(htmlContent, { ADD_TAGS: ['style'], ADD_ATTR: ['target'] });

  // 2. Wrap if not complete document
  let finalHtml = cleanHtml;
  if (!finalHtml.includes('<html')) {
     finalHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>body { font-family: sans-serif; padding: 20px; }</style>
        </head>
        <body>${cleanHtml}</body>
      </html>
    `;
  }

  // 3. Generate PDF
  return await generatePdfFromHtml(finalHtml, options);
}

export async function convertUrlToPdf(url: string, options: ConvertOptions): Promise<string> {
  // 1. Fetch URL Content
  // Note: For offline-first requirement, URL mode is the ONLY exception requiring internet.
  // We use Puppeteer to navigate directly, but we can also use JSDOM+Readability for "AI Cleaning" before printing.

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
    
    // "AI" Cleaning: Remove ads, cookie banners using heuristics
    await page.evaluate(() => {
        const selectorsToRemove = [
            'iframe[src*="ads"]', 
            '.ad', 
            '.ads', 
            '.cookie-banner', 
            '#cookie-consent', 
            '[class*="popup"]',
            '[id*="modal"]'
        ];
        selectorsToRemove.forEach(sel => {
            document.querySelectorAll(sel).forEach(el => el.remove());
        });
    });

    const fileName = `${uuidv4()}.pdf`;
    const filePath = path.join(TEMP_DIR, fileName);

    await page.pdf({
      path: filePath,
      format: options.paperSize || 'A4',
      landscape: options.orientation === 'landscape',
      printBackground: true,
      margin: { top: '1cm', right: '1cm', bottom: '1cm', left: '1cm' }
    });

    await browser.close();
    return `/temp/${fileName}`;

  } catch (error) {
    await browser.close();
    throw error;
  }
}

async function generatePdfFromHtml(html: string, options: ConvertOptions): Promise<string> {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const fileName = `${uuidv4()}.pdf`;
    const filePath = path.join(TEMP_DIR, fileName);

    await page.pdf({
      path: filePath,
      format: options.paperSize || 'A4',
      landscape: options.orientation === 'landscape',
      printBackground: true,
      margin: { top: '1cm', right: '1cm', bottom: '1cm', left: '1cm' }
    });

    await browser.close();
    return `/temp/${fileName}`;
  } catch (error) {
    await browser.close();
    throw error;
  }
}
