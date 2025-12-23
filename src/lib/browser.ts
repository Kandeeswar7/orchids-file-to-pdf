import chromium from "@sparticuz/chromium";
import puppeteerCore from "puppeteer-core";

let browserPromise: Promise<any> | null = null;

export async function getBrowser() {
  if (!browserPromise) {
    const isProd =
      process.env.NETLIFY === "true" ||
      process.env.NODE_ENV === "production";

    if (isProd) {
      console.log('[Browser] Launching Serverless Chromium...');
      const chromiumAny = chromium as any;
      
      // key performance/compatibility settings for serverless
      chromiumAny.setGraphicsMode = false;
      
      browserPromise = puppeteerCore.launch({
        args: chromiumAny.args,
        executablePath: await chromiumAny.executablePath(),
        headless: chromiumAny.headless,
        defaultViewport: {
          width: 794,
          height: 1123,
          deviceScaleFactor: 1,
          isMobile: false,
          hasTouch: false
        }
      });
    } else {
      console.log('[Browser] Launching Local Puppeteer...');
      const puppeteer = await import("puppeteer");
      browserPromise = puppeteer.default.launch({ 
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
      });
    }
  }
  return browserPromise;
}
