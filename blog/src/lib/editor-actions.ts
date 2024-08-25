import {
  LuAlignCenter,
  LuAlignJustify,
  LuAlignLeft,
  LuAlignRight,
  LuBold,
  LuHeading1,
  LuHeading2,
  LuHeading3,
  LuHeading4,
  LuHeading5,
  LuHeading6,
  LuHighlighter,
  LuImagePlus,
  LuItalic,
  LuList,
  LuListOrdered,
  LuPilcrow,
  LuQuote,
  LuStrikethrough,
} from "react-icons/lu";
import { EditorActionItem } from "../types";

export const editorButtonActions: EditorActionItem[] = [
  {
    label: "Paragraph",
    action: ({ editor }) => editor?.chain().focus().setParagraph().run(),
    icon: LuPilcrow,
    active: (editor) => editor.isActive("paragraph"),
  },
  {
    label: "Heading 1",
    action: ({ editor }) =>
      editor?.chain().focus().setHeading({ level: 1 }).run(),
    icon: LuHeading1,
    active: (editor) => editor.isActive("heading", { level: 1 }),
  },
  {
    label: "Heading 2",
    action: ({ editor }) =>
      editor?.chain().focus().setHeading({ level: 2 }).run(),
    icon: LuHeading2,
    active: (editor) => editor.isActive("heading", { level: 2 }),
  },
  {
    label: "Heading 3",
    action: ({ editor }) =>
      editor?.chain().focus().setHeading({ level: 3 }).run(),
    icon: LuHeading3,
    active: (editor) => editor.isActive("heading", { level: 3 }),
  },
  {
    label: "Heading 4",
    action: ({ editor }) =>
      editor?.chain().focus().setHeading({ level: 4 }).run(),
    icon: LuHeading4,
    active: (editor) => editor.isActive("heading", { level: 4 }),
  },
  {
    label: "Heading 5",
    action: ({ editor }) =>
      editor?.chain().focus().setHeading({ level: 5 }).run(),
    icon: LuHeading5,
    active: (editor) => editor.isActive("heading", { level: 5 }),
  },
  {
    label: "Heading 6",
    action: ({ editor }) =>
      editor?.chain().focus().setHeading({ level: 6 }).run(),
    icon: LuHeading6,
    active: (editor) => editor.isActive("heading", { level: 6 }),
  },
  {
    label: "Bold",
    action: ({ editor }) => editor?.chain().focus().toggleBold().run(),
    icon: LuBold,
    active: (editor) => editor.isActive("bold"),
  },
  {
    label: "Italic",
    action: ({ editor }) => editor?.chain().focus().toggleItalic().run(),
    icon: LuItalic,
    active: (editor) => editor.isActive("italic"),
  },
  {
    label: "Strikethrough",
    action: ({ editor }) => editor?.chain().focus().toggleStrike().run(),
    icon: LuStrikethrough,
    active: (editor) => editor.isActive("strike"),
  },
  {
    label: "Highlight",
    action: ({ editor }) => editor?.chain().focus().toggleHighlight().run(),
    icon: LuHighlighter,
    active: (editor) => editor.isActive("highlight"),
  },
  {
    label: "Bullet List",
    action: ({ editor }) => editor?.chain().focus().toggleBulletList().run(),
    icon: LuList,
    active: (editor) => editor.isActive("bulletList"),
  },
  {
    label: "Ordered List",
    action: ({ editor }) => editor?.chain().focus().toggleOrderedList().run(),
    icon: LuListOrdered,
    active: (editor) => editor.isActive("orderedList"),
  },
  {
    label: "Align Left",
    action: ({ editor }) => editor?.chain().focus().setTextAlign("left").run(),
    icon: LuAlignLeft,
    active: (editor) => editor.isActive({ textAlign: "left" }),
  },
  {
    label: "Align Center",
    action: ({ editor }) =>
      editor?.chain().focus().setTextAlign("center").run(),
    icon: LuAlignCenter,
    active: (editor) => editor.isActive({ textAlign: "center" }),
  },
  {
    label: "Align Right",
    action: ({ editor }) => editor?.chain().focus().setTextAlign("right").run(),
    icon: LuAlignRight,
    active: (editor) => editor.isActive({ textAlign: "right" }),
  },
  {
    label: "Justify",
    action: ({ editor }) =>
      editor?.chain().focus().setTextAlign("justify").run(),
    icon: LuAlignJustify,
    active: (editor) => editor.isActive({ textAlign: "justify" }),
  },
  {
    label: "Blockquote",
    action: ({ editor }) => editor?.chain().focus().toggleBlockquote().run(),
    icon: LuQuote,
    active: (editor) => editor.isActive("blockquote"),
  },
  {
    label: "Insert Image",
    action: ({ open }) => open?.(),
    icon: LuImagePlus,
    active: (editor) => editor.isActive("img"),
  },
  {
    label: "Image Block",
    action: ({ editor }) =>
      editor
        ?.chain()
        .focus()
        .insertContent("<custom-image-block></custom-image-block>")
        .run(),
    icon: LuImagePlus,
    active: (editor) => editor.isActive("CustomImageBlock"),
  },
];
export const filterEditorActions = (labels: string[], pick: boolean = true) => {
  const actionMap = new Map(
    editorButtonActions.map((action) => [action.label, action])
  );

  if (pick) {
    return labels
      .map((label) => actionMap.get(label))
      .filter(
        (action): action is (typeof editorButtonActions)[number] =>
          action !== undefined
      );
  } else {
    const labelSet = new Set(labels);
    return editorButtonActions.filter((action) => !labelSet.has(action.label));
  }
};
