import { PostCardExtension } from "@/src/lib/editor/extensions/mini-post-card";
import { PenstackYouTubeExtension } from "@/src/lib/editor/extensions/youtube-embed";
import { PenstackTwitterExtension } from "@/src/lib/editor/extensions/tweet-embed";
import { common, createLowlight } from "lowlight";
const lowlight = createLowlight(common);
import { PenstackSlashCommandExtension } from "@/src/lib/editor/extensions/slash-command";
import PenstackBlockquote from "@/src/lib/editor/extensions/blockquote";
import { PenstackCodeblock } from "@/src/lib/editor/extensions/code-block";
import { PenstackHeadingExtension } from "@/src/lib/editor/extensions/heading";
import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import Typography from "@tiptap/extension-typography";
import Image from "@tiptap/extension-image";
import CharacterCount from "@tiptap/extension-character-count";

import { TableOfContents } from "@/src/lib/editor/extensions/toc";
import { MediaExtension } from "@/src/lib/editor/extensions/media";
import { markPasteRule, PasteRule } from "@tiptap/core";
export const extensions = [
  StarterKit.configure({
    heading: false,
    codeBlock: false,
    blockquote: false,
  }),
  Table.configure({
    resizable: true,
  }),
  TableRow.extend({
    addPasteRules() {
      return [
        ...(this.parent?.() || []),
        {
          find: /^\|(.+\|)+$/gm,
          handler: ({ state, range, match }) => {
            const [fullMatch] = match;
            const cells = fullMatch.split("|").filter((cell) => cell !== "");
            const { tr } = state;
            const start = range.from;
            const end = range.to;

            const rowNodes = cells.map((cell) =>
              state.schema.nodes.tableCell.create(
                {},
                state.schema.nodes.paragraph.create(
                  {},
                  state.schema.text(cell.trim())
                )
              )
            );

            tr.delete(start, end).insert(
              start,
              state.schema.nodes.tableRow.create({}, rowNodes)
            );
          },
        },
      ];
    },
  }),
  TableHeader,
  TableCell.extend({
    addPasteRules() {
      return [
        ...(this.parent?.() || []),
        {
          find: /^\s*\|.*\|\s*$/gm,
          handler: ({ state, range, match }) => {
            const [fullMatch] = match;
            const cells = fullMatch.split("|").filter((cell) => cell !== "");
            const { tr } = state;
            const start = range.from;
            const end = range.to;

            const rowNodes = cells.map((cell) =>
              state.schema.nodes.tableCell.create(
                {},
                state.schema.nodes.paragraph.create(
                  {},
                  state.schema.text(cell.trim())
                )
              )
            );

            tr.delete(start, end).insert(
              start,
              state.schema.nodes.tableRow.create({}, rowNodes)
            );
          },
        },
      ];
    },
  }),
  PenstackHeadingExtension,
  PenstackBlockquote.configure(),
  Placeholder.configure({
    placeholder: "Write something…",
  }),
  Link.configure({
    HTMLAttributes: {
      rel: "noopener noreferrer",
    },
    openOnClick: false,
    autolink: true,
  }).extend({
    addPasteRules() {
      return [
        ...(this.parent?.() || []),
        markPasteRule({
          find: /(https?:\/\/[^ ]+)/,
          type: this.type,
          getAttributes: (match) => ({
            href: match[0],
          }),
        }),
      ];
    },
  }),

  Typography,
  Image,
  TextAlign.configure({
    types: ["heading", "paragraph"],
  }),
  Highlight,
  CharacterCount.configure({
    limit: 100000,
  }),
  TableOfContents,
  MediaExtension,
  PostCardExtension,
  PenstackCodeblock.configure({
    lowlight,
  }),
  PenstackYouTubeExtension,
  PenstackTwitterExtension,
  PenstackSlashCommandExtension,
];
