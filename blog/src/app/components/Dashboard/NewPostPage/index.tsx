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
import { encode } from "html-entities";
import TipTapEditor from "@/src/app/components/TipTapEditor";
import {
  AppEditorContextProvider,
  useCustomEditorContext,
} from "@/src/context/AppEditor";
import { ProtectedComponent } from "../../ProtectedComponent";

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
  const { activePost } = useCustomEditorContext();
  const [lastUpdate, setLastUpdate] = useState<Date | null>(
    activePost?.updated_at as Date
  );

  const { mutate } = useMutation({
    mutationFn: async (values: PostInsert) => {
      const response = await axios.put<{
        data: PostSelect;
        message: string;
        lastUpdate: string | Date;
      }>(`/api/posts/${values.post_id}`, values);
      return response.data;
    },
    onSuccess: (data) => {
      setLastUpdate(new Date(data.lastUpdate));
    },
    onError: (error) => {
      console.error("Error saving post:", error);
    },
  });

  const { author, ...postWithoutAuthor } = nullToEmptyString(activePost!);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      ...postWithoutAuthor,
    } as PostSelect,
    onSubmit: async (values) => {
      const postToSave: PostInsert = {
        title: values.title,
        slug: values.slug,
        summary: values.summary,
        visibility: values.visibility,
        content: values.content,
        featured_image_id: values.featured_image_id,
        status: values.status,
        post_id: values.post_id,
        author_id: author?.auth_id,
      };

      mutate(postToSave);
    },
  });

  const updatePost = useCallback((key: keyof PostSelect, value: any) => {
    formik.setFieldValue(key, value);
  }, []);

  // Handle slug generation
  useEffect(() => {
    if (
      formik.values.title &&
      formik.values.title?.length > 0 &&
      formik.values.title?.length <= 60
    ) {
      const generatedSlug = slugify(`${formik.values.title}`, {
        lower: true,
        strict: true,
      });
      updatePost("slug", generatedSlug);
    }
  }, [formik.values.title, updatePost]);

  return (
    <ProtectedComponent requiredPermission={"posts:create"}>
      <Box h="full" overflowY="auto">
        <TipTapEditor />
      </Box>
    </ProtectedComponent>
  );
}
