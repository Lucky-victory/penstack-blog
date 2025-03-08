import { Extension, generateJSON } from "@tiptap/core";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { Slice } from "@tiptap/pm/model";
import { marked, Token, Tokens } from "marked";

// Basic markdown to HTML conversion
export function markdownToHtml(markdown: string): string {
  // Configure marked to be more strict/safe
  marked.setOptions({
    breaks: true, // Convert line breaks to <br>
    gfm: true, // GitHub Flavored Markdown
    pedantic: false, // Don't conform to obscure parts of markdown
    renderer: createCustomRenderer(), // Use custom renderer for headings
  });

  try {
    const parsedHtml = marked.parse(markdown, { async: false }) as string;
 
    return parsedHtml;
  } catch (error) {
    console.error("Markdown conversion error:", error);
    return markdown; // Fallback to original text
  }
}

function createCustomRenderer() {
  const renderer = new marked.Renderer();

  // Override the heading renderer to add level attribute
  renderer.heading = function ({ depth, text }: Tokens.Heading) {
    return `<h${depth} level="${depth}">${text}</h${depth}>`;
  };
//   renderer.code = function ({ text, lang, ...r }: Tokens.Code) {
   

//     return `<pre language='${lang}'><code class="language-${lang}">${text}</code></pre>`;
//   };

  return renderer;
}

export const MarkdownPasteExtension = Extension.create({
  name: "markdownPaste",
  priority: 1,
  addPasteRules() {
    return [...(this.parent?.() || [])];
  },
  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey("markdownPaste"),
        props: {
          handlePaste: (view, event, slice) => {
            const clipboardData = event.clipboardData;
            if (!clipboardData) return false;

            const pastedText = clipboardData.getData("text/plain");

            // Detect markdown-like content more comprehensively
            if (isLikelyMarkdown(pastedText)) {
              // Convert markdown to HTML
              const htmlContent = markdownToHtml(pastedText);

              const extensions = this.editor.extensionManager.extensions;
              const txtJson = generateJSON(htmlContent, extensions);

              // Create a new slice with the HTML content
              const htmlSlice = Slice.fromJSON(view.state.schema, {
                content: txtJson?.content,
              });

              // Replace the pasted content with the converted HTML
              view.dispatch(view.state.tr.replaceSelection(htmlSlice));

              return true; // Indicate that we've handled the paste
            }
            return false;
          },
        },
      }),
    ];
  },
});

// More comprehensive markdown detection
function isLikelyMarkdown(text: string): boolean {
  const markdownPatterns = [
    /^(#{1,6})\s(.+)$/gm, // Heading
    /^\*{1,2}\s/, // Bold or italic list
    /^-{3,}$/, // Horizontal rule
    /^\d+\.\s/, // Ordered list
    /^>\s/, // Blockquote
    /\[.*\]\(.*\)/, // Markdown link
    /`{1,3}[^`\n]+~{3}/, // Inline code
    /^\s*```\s*[\w-]*\s*[\s\S]*?\s*```\s*$/, // Code block
    /^~~~([a-z]+)?\s*[\s\S]*?\s*~~~/,
    /\*\*.*\*\*/, // Bold
    /\*.*\*/, // Italic
    /^\|(.+\|)+$/, // Table row
    /^(\|:?-+:?\|)+$/, // Table alignment row
    /^\s*\|.*\|\s*$/, // Alternative table row pattern
    /^\s*\|-+\|(-+\|)*\s*$/, // Alternative table alignment pattern
    /!\[.*?\]\(.*?\)/, // Markdown image
  ];

  return markdownPatterns.some((pattern) => pattern.test(text));
}
