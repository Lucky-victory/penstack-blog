"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import { Box, useColorModeValue, Stack, useDisclosure } from "@chakra-ui/react";
import slugify from "slugify";
import { nullToEmptyString } from "@/src/utils";
import { PostInsert, PostSelect } from "@/src/types";
import { usePost } from "@/src/hooks";
import { useFormik } from "formik";
import { redirect, useParams, useRouter } from "next/navigation";
import Loader from "../../../Loader";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { debounce } from "lodash";
import { decode, encode } from "html-entities";
import TipTapEditor from "@/src/app/components/TipTapEditor";
import {
  AppEditorContextProvider,
  useCustomEditorContext,
} from "@/src/context/AppEditor";
import { PermissionGuard } from "../../../PermissionGuard";
import { useAuth } from "@/src/hooks/useAuth";

export default function NewPostPage() {
  const postId = useParams().postId as string;
  const { post, loading } = usePost(postId);

  if (loading) {
    return (
      <Stack h="full" align="center" justify="center">
        <Loader />
      </Stack>
    );
  }
  if (!loading && !post) redirect("/not-found");
  return (
    <AppEditorContextProvider post={post!}>
      <PostEditor />
    </AppEditorContextProvider>
  );
}

export function PostEditor() {
  const { activePost, setEditorContent, updateField } =
    useCustomEditorContext();
  const { user } = useAuth();
  function onEditorUpdate(content: { html: string; text?: string }) {
    setEditorContent(content);

    updateField("content", encode(content.html), true);
  }
  return (
    <PermissionGuard
      requiredPermission={"posts:create"}
      isOwner={activePost?.author?.auth_id === user?.id}
    >
      <Box h="full" overflowY="auto">
        <TipTapEditor
          onUpdate={onEditorUpdate}
          initialContent={decode(activePost?.content) || ""}
        />
      </Box>
    </PermissionGuard>
  );
}
