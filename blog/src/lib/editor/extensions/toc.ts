import { Node, mergeAttributes } from "@tiptap/core";

export interface TableOfContentsOptions {
  maxLevel: number;
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
          const headings = this.generateTOC(editor);
          console.log("headings:", headings);

          return commands.insertContent({
            type: this.name,
            content: headings,
          });
        },
    };
  },

  generateTOC(editor: any) {
    const headings: { level: number; text: string; id: string }[] = [];
    editor.state.doc.descendants((node: any, pos: number) => {
      if (
        node.type.name === "heading" &&
        node.attrs.level <= this.options.maxLevel
      ) {
        const id = `heading-${pos}`;
        headings.push({
          level: node.attrs.level,
          text: node.textContent,
          id,
        });
        return false;
      }
    });

    return headings;
  },
});
