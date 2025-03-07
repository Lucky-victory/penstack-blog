import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';

interface TOCItem {
  level: number;
  title: string;
  id: string;
}

export const TableOfContents = Extension.create({
  name: 'tableOfContents',

  addOptions() {
    return {
      levels: [1, 2, 3, 4, 5, 6],
    };
  },

  addStorage() {
    return {
      items: [] as TOCItem[],
    };
  },

  addProseMirrorPlugins() {
    const extension = this;
    return [
      new Plugin({
        key: new PluginKey('tableOfContents'),
        view(view) {
          const update = () => {
            const items: TOCItem[] = [];
            view.state.doc.descendants((node, pos) => {
              if (node.type.name === 'heading' && extension.options.levels.includes(node.attrs.level)) {
                items.push({
                  level: node.attrs.level,
                  title: node.textContent,
                  id: node.attrs.id,
                });
              }
            });
            extension.storage.items = items;
          };

          update();
          return { update };
        },
      }),
    ];
  },
});