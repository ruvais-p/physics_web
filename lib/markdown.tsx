import React, { ReactNode, Fragment } from 'react';
import { ExternalLink } from 'lucide-react';
import { sanitizeWebUrl } from '@/lib/url-security';

export interface InlineMarkdownOptions {
  linkClassName?: string;
  strongClassName?: string;
  emClassName?: string;
  codeClassName?: string;
  showExternalIcon?: boolean;
}

export function parseFormatting(
  text: string,
  keyPrefix: number,
  options?: Pick<InlineMarkdownOptions, 'strongClassName' | 'emClassName' | 'codeClassName'>
): ReactNode {
  const elements: ReactNode[] = [];
  const regex = /(\*\*|__)(.*?)\1|(\*|_)(.*?)\3|(`)(.*?)\5/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  const strongClass = options?.strongClassName ?? 'font-bold text-slate-900';
  const emClass = options?.emClassName ?? 'italic text-slate-800';
  const codeClass = options?.codeClassName ?? 'bg-slate-100 text-oxford px-1.5 py-0.5 rounded font-mono text-sm';

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      elements.push(text.substring(lastIndex, match.index));
    }

    if (match[1]) {
      elements.push(
        <strong key={`${keyPrefix}_b_${match.index}`} className={strongClass}>
          {match[2]}
        </strong>
      );
    } else if (match[3]) {
      elements.push(
        <em key={`${keyPrefix}_i_${match.index}`} className={emClass}>
          {match[4]}
        </em>
      );
    } else if (match[5]) {
      elements.push(
        <code key={`${keyPrefix}_c_${match.index}`} className={codeClass}>
          {match[6]}
        </code>
      );
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    elements.push(text.substring(lastIndex));
  }

  return elements.length === 1 ? elements[0] : <Fragment key={keyPrefix}>{elements}</Fragment>;
}

export function parseInlineMarkdown(
  text: string,
  options?: InlineMarkdownOptions
): ReactNode {
  const parts: ReactNode[] = [];
  let remaining = text;
  let keyIdx = 0;

  const linkClass = options?.linkClassName ?? 'text-cyan-accent hover:underline font-semibold inline-flex items-center gap-0.5';
  const showIcon = options?.showExternalIcon !== false;

  while (remaining) {
    const linkMatch = remaining.match(/^([\s\S]*?)\[([^\]]+)\]\(([^)]+)\)([\s\S]*)$/);
    if (linkMatch) {
      const [, before, label, url, after] = linkMatch;
      if (before) parts.push(parseFormatting(before, keyIdx++, options));
      parts.push(
        <a
          key={keyIdx++}
          href={sanitizeWebUrl(url) || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
        >
          <span>{label}</span>
          {showIcon && <ExternalLink className="w-3.5 h-3.5 opacity-80" />}
        </a>
      );
      remaining = after;
      continue;
    }

    parts.push(parseFormatting(remaining, keyIdx++, options));
    break;
  }

  return parts;
}

export interface MarkdownRenderOptions {
  paragraphClassName?: string;
  containerClassName?: string;
  inlineOptions?: InlineMarkdownOptions;
}

export function renderMarkdownText(
  md: string | null | undefined,
  emptyFallbackText: string | null = 'No description available yet.',
  options?: MarkdownRenderOptions
): ReactNode {
  if (!md || !md.trim()) {
    if (emptyFallbackText === null) return null;
    return <p className="text-base text-slate-500 italic">{emptyFallbackText}</p>;
  }

  const lines = md.split('\n');
  const elements: ReactNode[] = [];
  let currentList: { type: 'ul' | 'ol'; items: string[] } | null = null;
  const inlineOpts = options?.inlineOptions;
  const pClass = options?.paragraphClassName ?? 'text-base sm:text-lg lg:text-[20px] text-slate-700 leading-relaxed lg:leading-[1.75] font-sans font-normal my-4';

  const flushList = () => {
    if (currentList) {
      if (currentList.type === 'ul') {
        elements.push(
          <ul key={`ul_${elements.length}`} className="list-disc ml-6 space-y-2.5 my-4 text-base sm:text-lg lg:text-[20px] leading-relaxed text-slate-700 font-sans">
            {currentList.items.map((item, idx) => (
              <li key={idx}>{parseInlineMarkdown(item, inlineOpts)}</li>
            ))}
          </ul>
        );
      } else {
        elements.push(
          <ol key={`ol_${elements.length}`} className="list-decimal ml-6 space-y-2.5 my-4 text-base sm:text-lg lg:text-[20px] leading-relaxed text-slate-700 font-sans">
            {currentList.items.map((item, idx) => (
              <li key={idx}>{parseInlineMarkdown(item, inlineOpts)}</li>
            ))}
          </ol>
        );
      }
      currentList = null;
    }
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      const itemText = trimmed.slice(2);
      if (!currentList || currentList.type !== 'ul') {
        flushList();
        currentList = { type: 'ul', items: [itemText] };
      } else {
        currentList.items.push(itemText);
      }
      return;
    }

    if (/^\d+\.\s/.test(trimmed)) {
      const itemText = trimmed.replace(/^\d+\.\s/, '');
      if (!currentList || currentList.type !== 'ol') {
        flushList();
        currentList = { type: 'ol', items: [itemText] };
      } else {
        currentList.items.push(itemText);
      }
      return;
    }

    flushList();

    if (!trimmed) {
      return;
    }

    if (trimmed.startsWith('# ')) {
      elements.push(
        <h2 key={index} className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-oxford font-serif mt-8 mb-4">
          {parseInlineMarkdown(trimmed.slice(2), inlineOpts)}
        </h2>
      );
      return;
    }

    if (trimmed.startsWith('## ')) {
      elements.push(
        <h3 key={index} className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800 font-serif mt-6 mb-3">
          {parseInlineMarkdown(trimmed.slice(3), inlineOpts)}
        </h3>
      );
      return;
    }

    if (trimmed.startsWith('### ')) {
      elements.push(
        <h4 key={index} className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-800 font-serif mt-5 mb-2">
          {parseInlineMarkdown(trimmed.slice(4), inlineOpts)}
        </h4>
      );
      return;
    }

    if (trimmed.startsWith('> ')) {
      elements.push(
        <blockquote key={index} className="border-l-4 border-cyan-accent pl-5 py-3 my-5 italic text-slate-700 font-sans text-base sm:text-lg lg:text-[20px] leading-relaxed bg-slate-50/70 rounded-r-xl">
          {parseInlineMarkdown(trimmed.slice(2), inlineOpts)}
        </blockquote>
      );
      return;
    }

    elements.push(
      <p key={index} className={pClass}>
        {parseInlineMarkdown(trimmed, inlineOpts)}
      </p>
    );
  });

  flushList();
  return <div className={options?.containerClassName ?? 'space-y-3 font-sans'}>{elements}</div>;
}
