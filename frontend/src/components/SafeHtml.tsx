'use client'

import { useEffect, useState } from 'react';

export default function SafeHtml({ html, className }: { html: string; className?: string }) {
  const [sanitized, setSanitized] = useState('');

  useEffect(() => {
    const sanitizeHtml = async () => {
      const DOMPurify = (await import('dompurify')).default;

      const clean = DOMPurify.sanitize(html, {
        ADD_TAGS: [
          'h1', 'h2', 'h3', 'p', 'span', 'strong', 'b', 'i', 'u', 's', 'em', 'blockquote',
          'ul', 'ol', 'li', 'a', 'img', 'pre', 'code', 'br', 'hr', 'div',
          'table', 'thead', 'tbody', 'tr', 'th', 'td', 'sup', 'sub'
        ],
        ADD_ATTR: [
          'href', 'src', 'alt', 'title', 'style', 'class', 'target', 'rel', 'width', 'height', 'align'
        ],
      });
      setSanitized(clean);
    };

    if (html) {
      sanitizeHtml();
    }
  }, [html]);

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitized }}
    />
  );
}