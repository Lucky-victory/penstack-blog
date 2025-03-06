import { marked } from "marked";

// Basic markdown to HTML conversion
export function markdownToHtml(markdown: string): string {
  // Configure marked to be more strict/safe
  marked.setOptions({
    breaks: true, // Convert line breaks to <br>
    gfm: true, // GitHub Flavored Markdown
    pedantic: false, // Don't conform to obscure parts of markdown
  });

  try {
    return marked.parse(markdown, { async: false });
  } catch (error) {
    console.error("Markdown conversion error:", error);
    return markdown; // Fallback to original text
  }
}

// Enhanced Tiptap Extension with Marked Conversion
import { Extension, generateJSON } from "@tiptap/core";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { Slice } from "@tiptap/pm/model";

export const MarkdownPasteExtension = Extension.create({
  name: "markdownPaste",

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
              console.log({
                schema: view.state.schema,
                htmlContent,
              });

              // Create a new slice with the HTML content
              const htmlSlice = Slice.fromJSON(view.state.schema, {
                content: htmlContent,
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
    /^#{1,6}\s/, // Headers (h1-h6)
    /^\*{1,2}\s/, // Bold or italic list
    /^-{3,}$/, // Horizontal rule
    /^\d+\.\s/, // Ordered list
    /^>\s/, // Blockquote
    /\[.*\]\(.*\)/, // Markdown link
    /`{1,3}[^`\n]+`{1,3}/, // Inline code
    /\*\*.*\*\*/, // Bold
    /\*.*\*/, // Italic
  ];

  return markdownPatterns.some((pattern) => pattern.test(text));
}
