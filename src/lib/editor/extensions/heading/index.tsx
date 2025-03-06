import { PenstackHeadingsRenderer } from "@/src/app/components/Renderers/HeadingsRenderer";
import { generateSlug } from "@/src/utils";
import { As, Heading as ChakraHeading } from "@chakra-ui/react";
import Heading from "@tiptap/extension-heading";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import {
  Node,
  nodePasteRule,
  NodeViewRendererProps,
  NodeViewWrapper,
  ReactNodeViewRenderer,
} from "@tiptap/react";

export const PenstackHeadingExtension = Heading.extend({
  priority: 1000,

  addPasteRules() {
    return [
      ...(this.parent?.() || []),
      nodePasteRule({
        find: /^(#{1,6})\s(.+)$/gm,
        type: this.type,
      }),
    ];
  },

  addProseMirrorPlugins() {
    return [
      ...(this.parent?.() || []),
      new Plugin({
        key: new PluginKey("heading-ids"),
        appendTransaction: (transactions, oldState, newState) => {
          const docChanged = transactions.some((tr) => tr.docChanged);
          if (!docChanged) return;

          const tr = newState.tr;
          let modified = false;

          newState.doc.descendants((node, pos) => {
            if (node.type.name === "heading") {
              const newId = generateSlug(node.textContent);
              console.log({
                node,
                pos,
                newId,
              });

              if (newId && node.attrs.id !== newId) {
                tr.setNodeMarkup(pos, undefined, {
                  ...node.attrs,
                  id: newId,
                });
                modified = true;
              }
            }
          });

          return modified ? tr : null;
        },
      }),
    ];
  },

  addNodeView() {
    const Comp = ({ node }: NodeViewRendererProps) => {
      const level = node.attrs.level || 1;
      console.log({ node, level, attrs: node.attrs });

      return (
        <PenstackHeadingsRenderer
          attrs={{ as: `h${level}` as As, id: node.attrs?.id }}
          isEditing={true}
        >
          {node.content.firstChild?.text}
        </PenstackHeadingsRenderer>
      );
    };
    return ReactNodeViewRenderer(Comp);
  },

  addAttributes() {
    return {
      ...this.parent?.(),
      id: {
        default: null,
        parseHTML: (element) => element.getAttribute("id"),
        renderHTML: (attributes) => ({
          id: attributes.id,
        }),
      },
      // level: {
      //   default: 1,
      //   parseHTML: (element) => Number(element.tagName.replace("h", "")),
      //   renderHTML: (attributes) => ({
      //     level: attributes.level,
      //   }),
      // },
    };
  },
});
