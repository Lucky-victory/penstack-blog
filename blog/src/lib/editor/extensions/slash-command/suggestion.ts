import tippy, { Instance, Props } from "tippy.js";

import {
  CommandListItem,
  SlashCommandList,
  SlashCommandListProps,
  SlashCommandListRef,
} from "@/src/app/components/TextEditor/extensions/CommandList";
import { Editor, ReactRenderer } from "@tiptap/react";
import { LuCode2, LuHeading1, LuList } from "react-icons/lu";
import { ForwardRefExoticComponent, RefAttributes } from "react";

const items = [
  {
    title: "Heading 1",
    icon: LuHeading1,
    command: ({
      editor,
      range,
    }: {
      editor: Editor;
      range: { from: number; to: number };
    }) => {
      editor
        .chain()
        .focus()
        .deleteRange(range)
        .setNode("heading", { level: 1 })
        .run();
    },
  },
  {
    title: "Bullet List",
    icon: LuList,
    command: ({
      editor,
      range,
    }: {
      editor: Editor;
      range: { from: number; to: number };
    }) => {
      editor.chain().focus().deleteRange(range).toggleBulletList().run();
    },
  },
  {
    title: "Code Block",
    icon: LuCode2,
    command: ({
      editor,
      range,
    }: {
      editor: Editor;
      range: { from: number; to: number };
    }) => {
      editor.chain().focus().deleteRange(range).setNode("codeBlock").run();
    },
  },
];

export default function slashSuggestions(blockTools: CommandListItem[]) {
  return {
    items: ({ query }: { query: string }) => {
      return blockTools.filter((item) =>
        item.title.toLowerCase().startsWith(query.toLowerCase())
      );
    },

    render: () => {
      let component: ReactRenderer<
        SlashCommandListRef,
        SlashCommandListProps & RefAttributes<SlashCommandListRef>
      >;
      let popup: Instance<Props>[];
      console.log(component!);
      return {
        onStart: (props: any) => {
          const comp = new ReactRenderer(SlashCommandList, {
            props,
            editor: props.editor,
          });
          component = comp.component;
          console.log("onStart", props);
          console.log(component);
          if (!props.clientRect) {
            return;
          }

          popup = tippy("body", {
            getReferenceClientRect: props.clientRect,
            appendTo: () => component.editor.view.dom.parentNode?.parentNode,
            content: component.element,
            showOnCreate: true,
            interactive: true,
            trigger: "manual",
            placement: "bottom-start",
          });
        },
        onUpdate(props: any) {
          component.updateProps(props);
          console.log("onUpdate", props);
          console.log("onUpdate", { popup });
          if (!props.clientRect) {
            return;
          }

          popup[0].setProps({
            getReferenceClientRect: props.clientRect,
          });
        },

        onKeyDown(props: any) {
          console.log("onKeyDown", props);
          console.log("onKeyDown", popup);
          if (props.event.key === "Escape") {
            popup[0].hide();

            return true;
          }

          return component.ref?.onKeyDown(props.event);
        },

        onExit() {
          if (popup && popup[0]) {
            popup[0].destroy();
          }
          component && component?.destroy();
        },
      };
    },
  };
}
