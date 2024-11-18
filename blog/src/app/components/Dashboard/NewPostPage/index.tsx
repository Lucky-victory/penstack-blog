"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import { Box, useColorModeValue, Stack, useDisclosure } from "@chakra-ui/react";
import slugify from "slugify";
import { nullToEmptyString } from "@/src/utils";
import { PostInsert, PostSelect } from "@/src/types";
import { usePost } from "@/src/hooks";
import { useFormik } from "formik";
import { useParams, useRouter } from "next/navigation";
import Loader from "../../Loader";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { debounce } from "lodash";
import { decode, encode } from "html-entities";
import TipTapEditor from "@/src/app/components/TipTapEditor";
import {
  AppEditorContextProvider,
  useCustomEditorContext,
} from "@/src/context/AppEditor";
import { ProtectedComponent } from "../../ProtectedComponent";
import NetworkAvailabiltyCheck from "../../NetworkAvailabiltyCheck";

export default function NewPostPage() {
  const postId = useParams().postId as string;
  const { post, loading } = usePost(postId);

  if (loading || !post) {
    return (
      <Stack h="full" align="center" justify="center">
        <Loader />
      </Stack>
    );
  }
  return (
    <AppEditorContextProvider post={post}>
      <PostEditor />
    </AppEditorContextProvider>
  );
}

export function PostEditor() {
  const { activePost, setEditorContent } = useCustomEditorContext();

  function onEditorUpdate(content: { html: string; text?: string }) {
    setEditorContent(content);
    console.log(content);
  }
  return (
    <NetworkAvailabiltyCheck>
      <ProtectedComponent requiredPermission={"posts:create"}>
        <Box h="full" overflowY="auto">
          <TipTapEditor
            onUpdate={onEditorUpdate}
            initialContent={decode(activePost?.content) || ""}
          />
        </Box>
      </ProtectedComponent>
    </NetworkAvailabiltyCheck>
  );
}
