import { renderToStaticMarkup, TReaderDocument } from '@usewaypoint/email-builder';

declare global {
  interface Window {
    renderEmailToHtml: (document: TReaderDocument) => string;
  }
}

/**
 * Renders an email document to HTML string.
 * @param document - The email document configuration
 * @returns The rendered HTML string
 */
export function renderEmailToHtml(document: TReaderDocument): string {
  return renderToStaticMarkup(document, { rootBlockId: 'root' });
}

window.renderEmailToHtml = renderEmailToHtml;