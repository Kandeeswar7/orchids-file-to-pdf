export type JobStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface ConversionJob {
  id: string;
  type: 'excel' | 'html-file' | 'html-code' | 'url';
  status: JobStatus;
  progress: number;
  filename?: string; // PDF filename in /public/temp
  originalName?: string;
  error?: string;
  createdAt: number;
  options?: any;
}

export interface ConvertRequest {
  type: 'excel' | 'html-file' | 'html-code' | 'url';
  data: string; // Base64 for files, text for code/url
  options?: {
    orientation?: 'portrait' | 'landscape';
    paperSize?: 'A4' | 'Letter';
    gridlines?: boolean;
    scale?: number;
  };
}