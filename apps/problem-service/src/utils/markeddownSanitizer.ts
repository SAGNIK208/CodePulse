import marked from "marked";
import sanitizeHtml from "sanitize-html";
import TurndownService from "turndown";

async function markdownSanitize(markdown: string): Promise<string> {
  const turndownService = new TurndownService();

  const html = await marked.parse(markdown);

  const sanitizedHtml = sanitizeHtml(html, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img"]),
  });

  return turndownService.turndown(sanitizedHtml);
}

export default markdownSanitize;
