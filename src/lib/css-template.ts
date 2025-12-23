export const PRINT_STYLES = `
  /* Master Print Bedrock */
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,400;0,700;1,400;1,700&family=Noto+Serif:ital,wght@0,400;0,700;1,400;1,700&display=swap');

  @page {
    size: A4;
    margin: 20mm;
  }

  * {
    box-sizing: border-box;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  html, body {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    -webkit-font-smoothing: antialiased;
  }

  body {
    font-family: 'Noto Sans', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    font-size: 12pt;
    line-height: 1.5;
    color: #000;
    background: #fff;
  }

  /* Typography Normalization */
  h1, h2, h3, h4, h5, h6 {
    font-family: 'Noto Serif', Georgia, serif;
    margin-top: 1.5em;
    margin-bottom: 0.8em;
    page-break-after: avoid;
    break-after: avoid;
  }

  p {
    margin-bottom: 1em;
    orphans: 3;
    widows: 3;
  }

  /* Table Stability */
  table {
    border-collapse: collapse;
    width: 100%;
    margin-bottom: 1em;
    page-break-inside: auto;
  }

  tr {
    page-break-inside: avoid;
    break-inside: avoid;
  }

  td, th {
    padding: 8px;
    border: 1px solid #ccc;
    vertical-align: top;
  }

  /* Image Handling */
  img {
    max-width: 100%;
    height: auto;
    page-break-inside: avoid;
    break-inside: avoid;
  }

  /* Layout Containers */
  .document-container {
    width: 100%;
    max-width: 210mm; /* A4 Width */
    margin: 0 auto;
    background: white;
  }
`;

export const EXCEL_STYLES = `
  table { 
    font-size: 10pt;
    border: 1px solid #bfbfbf;
  }
  
  th {
    background-color: #f3f3f3;
    font-weight: bold;
    border: 1px solid #bfbfbf;
    text-align: center;
  }

  td {
    border: 1px solid #cecece;
    padding: 4px 8px;
  }
`;
