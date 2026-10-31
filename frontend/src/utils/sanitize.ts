/**
 * sanitize.ts
 *
 * DOMPurify ile HTML sanitizasyonu için merkezi yardımcı.
 * dangerouslySetInnerHTML kullanılan her yerde bu fonksiyonu kullanın;
 * ham Quill/API çıktısını doğrudan DOM'a ASLA vermeyin.
 *
 * Kullanım:
 *   import { sanitizeHtml } from '../utils/sanitize';
 *   <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(content) }} />
 */

import DOMPurify from 'dompurify';

/**
 * Varsayılan güvenli yapılandırma:
 * - script, iframe, object, embed, form, input etiketleri yasaklı
 * - on* event handler'ları temizlenir
 * - Quill çıktısının normal HTML etiketlerine izin verilir
 */
const ALLOWED_TAGS = [
  'p', 'br', 'b', 'i', 'u', 's', 'strong', 'em', 'strike',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'ul', 'ol', 'li',
  'blockquote', 'pre', 'code',
  'a', 'img',
  'table', 'thead', 'tbody', 'tr', 'th', 'td',
  'div', 'span',
  'sub', 'sup',
];

const ALLOWED_ATTR = [
  'href', 'target', 'rel',
  'src', 'alt', 'title', 'width', 'height',
  'class', 'style',
  'colspan', 'rowspan',
];

export const sanitizeHtml = (dirty: string | null | undefined): string => {
  if (!dirty) return '';
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    FORCE_BODY: true,
  }) as string;
};

/** Sadece düz metin döndürür — tüm HTML etiketlerini kaldırır */
export const stripHtml = (dirty: string | null | undefined): string => {
  if (!dirty) return '';
  return DOMPurify.sanitize(dirty, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] }) as string;
};
