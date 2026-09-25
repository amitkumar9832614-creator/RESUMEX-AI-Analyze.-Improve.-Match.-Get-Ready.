import mammoth from 'mammoth';
import { PDFParse } from 'pdf-parse';

export interface ParseResult {
  text: string;
  pageCount?: number;
  wordCount: number;
  fileType: 'pdf' | 'docx' | 'txt';
  isScannedOrEmpty: boolean;
  warning?: string;
}

export async function parseResumeBuffer(
  buffer: Buffer,
  filename: string,
  mimetype?: string
): Promise<ParseResult> {
  const ext = filename.split('.').pop()?.toLowerCase();

  if (buffer.length === 0) {
    throw new Error('The uploaded file is empty (0 bytes). Please upload a valid resume.');
  }

  // Max 10MB
  if (buffer.length > 10 * 1024 * 1024) {
    throw new Error('File size exceeds the 10MB limit. Please upload a smaller resume document.');
  }

  let text = '';
  let pageCount = 1;
  let fileType: 'pdf' | 'docx' | 'txt' = 'pdf';

  if (ext === 'pdf' || mimetype === 'application/pdf') {
    fileType = 'pdf';
    try {
      const parser = new PDFParse({ data: buffer });
      const textResult = await parser.getText();
      text = textResult.text || '';
      pageCount = textResult.pages ? textResult.pages.length : 1;
      await parser.destroy();
    } catch (err: any) {
      throw new Error(`Failed to parse PDF document: ${err.message || 'Corrupted or unreadable format'}`);
    }
  } else if (ext === 'docx' || mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    fileType = 'docx';
    try {
      const result = await mammoth.extractRawText({ buffer });
      text = result.value || '';
    } catch (err: any) {
      throw new Error(`Failed to parse DOCX document: ${err.message || 'Corrupted or unreadable Word document'}`);
    }
  } else if (ext === 'txt' || mimetype === 'text/plain') {
    fileType = 'txt';
    text = buffer.toString('utf-8');
  } else {
    throw new Error('Unsupported file format. Please upload a PDF (.pdf) or Word document (.docx).');
  }

  // Clean text
  const cleanText = text
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/\t/g, ' ')
    .replace(/[ \u00A0]+/g, ' ')
    .trim();

  const words = cleanText.split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  let isScannedOrEmpty = false;
  let warning: string | undefined;

  if (wordCount < 30) {
    isScannedOrEmpty = true;
    warning = 'Unable to extract sufficient readable text from this document. It may be an image-only/scanned PDF without OCR or an empty resume. Please upload a text-selectable PDF or DOCX file.';
  }

  return {
    text: cleanText,
    pageCount,
    wordCount,
    fileType,
    isScannedOrEmpty,
    warning,
  };
}
