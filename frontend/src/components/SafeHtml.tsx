'use client'

import DOMPurify from 'dompurify';
import { useEffect, useState } from 'react';

export default function SafeHtml({ html, className }: { html: string; className?: string }) {
  const [sanitized, setSanitized] = useState('');

  useEffect(() => {
    // 브라우저 환경에서만 실행됩니다.
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
  }, [html]);

  return (
    <div
      dangerouslySetInnerHTML={{ __html: sanitized }} 
    />
  );
}