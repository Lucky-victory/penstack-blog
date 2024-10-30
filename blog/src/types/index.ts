import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { posts } from "@/src/db/schemas/posts.sql";
import { Editor } from "@tiptap/react";
import { IconType } from "react-icons";
import { permissions, users } from "../db/schemas";
export type UserSelect = InferSelectModel<typeof users>;
export type PostToPost = PostInsert & {
  categories: string[];
  tags: string[];
};
export type PostInsert = InferInsertModel<typeof posts>;
type Permissions = InferInsertModel<typeof permissions>;
export type TPermissions = Permissions["name"];
export type PostSelect = InferSelectModel<typeof posts> & {
  author: {
    name: string;
    avatar: string;
    username: string;
  };
  category?: {
    id: number;
    slug: string;
    name: string;
  };
};

export interface EditorActionItem {
  label: string;
  command: ({ editor, open }: { editor?: Editor; open?: () => void }) => void;
  icon: IconType;
  active: (editor: Editor) => boolean;
}
