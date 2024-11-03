// TableOfContents.ts
import { Node, mergeAttributes } from "@tiptap/core";

export interface TableOfContentsOptions {
  maxLevel: number;
}

interface HeadingItem {
  level: number;
  text: string;
  id: string;
  items?: HeadingItem[];
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    tableOfContents: {
      insertTableOfContents: () => ReturnType;
    };
  }
}

export const TableOfContents = Node.create<TableOfContentsOptions>({
  name: "tableOfContents",
  group: "block",
  atom: true,
  draggable: true,

  addOptions() {
    return {
      maxLevel: 3,
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="table-of-contents"]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, { "data-type": "table-of-contents" }),
    ];
  },

  addCommands() {
    return {
      insertTableOfContents:
        () =>
        ({ editor, commands }) => {
          // First, collect all headings in a flat array
          const flatHeadings: HeadingItem[] = [];
          editor.state.doc.descendants((node: any, pos: number) => {
            if (
              node.type.name === "heading" &&
              node.attrs.level <= this.options.maxLevel
            ) {
              const id = `heading-${pos}`;
              flatHeadings.push({
                level: node.attrs.level,
                text: node.textContent,
                id,
                items: [],
              });
              return false;
            }
          });

          // Convert flat array to nested structure
          const buildNestedHeadings = (
            headings: HeadingItem[]
          ): HeadingItem[] => {
            const root: HeadingItem[] = [];
            const stack: HeadingItem[] = [];

            headings.forEach((heading) => {
              // Remove all items from stack that are of higher or same level
              while (
                stack.length > 0 &&
                stack[stack.length - 1].level >= heading.level
              ) {
                stack.pop();
              }

              if (stack.length === 0) {
                // This is a top-level heading
                root.push(heading);
              } else {
                // This is a sub-heading
                const parent = stack[stack.length - 1];
                if (!parent.items) {
                  parent.items = [];
                }
                parent.items.push(heading);
              }

              stack.push(heading);
            });

            return root;
          };

          const nestedHeadings = buildNestedHeadings(flatHeadings);

          // Create HTML content from nested structure
          const createTocHTML = (items: HeadingItem[]): string => {
            if (!items.length) return "";

            return `<ul>${items
              .map(
                (item) => `
                <li>
                  <a href="#${item.id}">${item.text}</a>
                  ${item.items ? createTocHTML(item.items) : ""}
                </li>
              `
              )
              .join("")}</ul>`;
          };

          const tocHtml = createTocHTML(nestedHeadings);

          return commands.insertContent({
            type: this.name,
            attrs: {
              "data-type": "table-of-contents",
            },
            content: [
              {
                type: "paragraph",
                content: [
                  {
                    type: "text",
                    text: "Table of Contents",
                    marks: [{ type: "bold" }],
                  },
                ],
              },
              {
                type: "paragraph",
                content: [
                  {
                    type: "html",
                    text: tocHtml,
                  },
                ],
              },
            ],
          });
        },
    };
  },
});
