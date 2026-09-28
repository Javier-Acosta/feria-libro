const allowedTags = "p|br|strong|b|em|i|u|s|h2|h3|ul|ol|li|blockquote|a|img";

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character] ?? character);
}

function plainTextToHtml(value: string) {
  const paragraphs = value.trim().split(/\r?\n\s*\r?\n/).map(paragraph => paragraph.replace(/\r?\n/g, " ").trim()).filter(Boolean);
  return paragraphs.map(paragraph => `<p>${escapeHtml(paragraph)}</p>`).join("");
}

/** Converts legacy plain text to paragraphs and keeps a small, safe HTML subset. */
export function sanitizeRichText(value: unknown) {
  const raw = String(value ?? "").trim();
  if (!raw) return "";
  if (!/<\/?[a-z][^>]*>/i.test(raw)) return plainTextToHtml(raw);

  return raw
    .replace(/<\s*(script|style|iframe|object|embed|form|textarea|template)[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi, "")
    .replace(/\s+on[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(new RegExp(`<(?!\\/?(?:${allowedTags})(?:\\s|>|/))[^>]*>`, "gi"), "")
    .replace(/<(a|img)\b([^>]*)>/gi, (_match, tag: string, attributes: string) => {
      const safeAttributes = attributes
        .replace(/\s+(?:style|class|id|target|rel|width|height|loading)\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, "")
        .replace(/\s+(href|src)\s*=\s*(["'])\s*(.*?)\2/gi, (_: string, name: string, quote: string, url: string) => /^(?:https?:\/\/|mailto:|\/)/i.test(url.trim()) ? ` ${name}=${quote}${escapeHtml(url.trim())}${quote}` : "")
        .replace(/\s+(href|src)\s*=\s*([^\s>]+)/gi, (_: string, name: string, url: string) => /^(?:https?:\/\/|mailto:|\/)/i.test(url) ? ` ${name}="${escapeHtml(url)}"` : "");
      return `<${tag.toLowerCase()}${safeAttributes}>`;
    });
}
