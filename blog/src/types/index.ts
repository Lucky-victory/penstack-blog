import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { posts } from "@/src/db/schemas/posts.sql";
import { Editor } from "@tiptap/react";
import { IconType } from "react-icons";
import { medias, permissions, users } from "../db/schemas";
export type UserSelect = InferSelectModel<typeof users>;
export type PostToPost = PostInsert & {
  categories: string[];
  tags: string[];
};
export type MediaInsert = InferInsertModel<typeof medias>;
export type MediaType = MediaInsert["type"];
export type MediaResponse = InferSelectModel<typeof medias>;
export type PostInsert = InferInsertModel<typeof posts>;
type Permissions = InferInsertModel<typeof permissions>;
export type TPermissions = Permissions["name"];
export type PostSelect = InferSelectModel<typeof posts> & {
  views: {
    count: number;
  };
  featured_image: {
    url: string;
    alt_text?: string;
    caption?: string;
  } | null;
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
  tags?: Array<{
    id: number;
    slug: string;
    name: string;
  }> | null;
};

export interface EditorActionItem {
  label: string;
  command: ({ editor, open }: { editor?: Editor; open?: () => void }) => void;
  icon: IconType;
  active: (editor: Editor) => boolean;
}
