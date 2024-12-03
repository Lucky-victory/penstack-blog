import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { posts } from "@/src/db/schemas/posts.sql";
import { Editor } from "@tiptap/react";
import { IconType } from "react-icons";
import { medias, newsletters, permissions, roles, users } from "../db/schemas";
import { useFormik } from "formik";
import { ElementType } from "react";
export type UserSelect = InferSelectModel<typeof users>;
export type UserInsert = InferInsertModel<typeof users>;
export type RolesSelect = InferSelectModel<typeof roles>;
export type NewsletterInsert = InferInsertModel<typeof newsletters>;
export type NewsletterSelect = InferSelectModel<typeof newsletters>;
export type PostToPost = PostInsert & {
  categories: string[];
  tags: string[];
};
export interface UrlUploadProps {
  url: string;
  folder?: string;
  filename?: string;
}
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
    auth_id: string;
    name: string;
    avatar: string;
    username: string;
    bio?: string;
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
  id: string | number;
  label: string;
  command: ({ editor, open }: { editor?: Editor; open?: () => void }) => void;
  icon: IconType;
  active: (editor: Editor) => boolean;
}
export interface FilterParams {
  type?: MediaType[];
  folder?: string;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: "created_at" | "name" | "size";
  sortOrder?: "asc" | "desc";
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
export type EDITOR_CONTEXT_STATE = {
  hasError: boolean;
  editor: Editor | null;
  setEditor: (editor: Editor | null) => void;
  isSaving: boolean;
  isDirty: boolean;
  updateField: <K extends keyof PostInsert>(
    key: K,
    value: PostInsert[K],
    shouldAutosave?: boolean
  ) => void;
  activePost: PostSelect | null;
  setActivePost: (post: PostSelect | null) => void;
  initialContent: string;
  setInitialContent: (content: string) => void;
  setEditorContent: (content: EDITOR_CONTEXT_STATE["content"]) => void;
  savePost: () => void;
  updatePost?: (key: keyof PostInsert, value: any) => void;
  formik?: ReturnType<typeof useFormik<PostInsert>> | null;
  markdownContent?: string;
  content: {
    text?: string;
    html: string;
  };
  clearEditor: () => void;
  setIsSaving?: (isSaving: boolean) => void;
  isEditorReady: boolean;
  meta: {
    wordCount: number;
    characterCount: number;
  };
};
export interface NavItem {
  icon: ElementType;
  label: string;
  href: string;
  permission?: TPermissions;
  children?: Array<{
    label: string;
    href: string;
    permission?: TPermissions;
  }>;
}
export const navPermissionMapping = {
  VIEW_DASHBOARD: "dashboard:view",
  VIEW_POSTS: "posts:read",
  CREATE_POST: "posts:create",
  VIEW_USERS: "users:read",
  VIEW_MEDIA: "media:read",
  VIEW_SETTINGS: "settings:read",
} as const;
