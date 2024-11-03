"use client";
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import {
  Box,
  Button,
  Input,
  Flex,
  useColorModeValue,
  Stack,
  Text,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from "@chakra-ui/react";

import { LuSettings } from "react-icons/lu";
import TextEditor from "@/src/app/components/TextEditor";
import slugify from "slugify";
import {
  // debounce,
  formatDate,
  nullToEmptyString,
  shortenText,
  shortIdGenerator,
} from "@/src/utils";
import { PostInsert, PostSelect } from "@/src/types";
import { useAutoSave, usePost, useQueryParams } from "@/src/hooks";
import DashHeader from "@/src/app/components/Dashboard/Header";
import { SidebarContent } from "@/src/app/components/Dashboard/NewPostPage/Sidebar";
import { useFormik } from "formik";
import { TitleInput } from "@/src/app/components/Dashboard/NewPostPage/TitleInput";
import { useParams } from "next/navigation";
import Loader from "../../Loader";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { debounce } from "lodash";

const META_DESCRIPTION_LENGTH = 155;

export default function NewPostPage() {
  const postId = useParams().postId as string;
  const { post, loading } = usePost(postId);

  if (loading || !post) {
    return (
      <Stack h={"full"} align={"center"} justify={"center"}>
        <Loader />
      </Stack>
    );
  }
  return <PostEditor post={post!} />;
}
export function PostEditor({ post }: { post: PostSelect }) {
  const [editorCounts, setEditorCounts] = useState({ words: 0, characters: 0 });
  const [lastUpdate, setLastUpdate] = useState<Date | null>(
    post?.updated_at as Date
  );
  const borderColor = useColorModeValue("gray.300", "gray.700");

  const randomNumId = useMemo(
    () => shortIdGenerator.bigIntId().substring(6, 12),
    []
  );
  const {
    mutate,
    data,
    isPending: isSaving,
  } = useMutation({
    mutationFn: async (values: PostInsert) => {
      const response = await axios.put<{
        message: string;
        lastUpdate: string | Date;
      }>("/api/posts/" + values?.post_id, values);
      return response.data;
    },
  });
  const { author, ...postWithoutAuthor } = nullToEmptyString(post!);
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: postWithoutAuthor as PostSelect,
    onSubmit: async (values) => {
      const {
        title,
        slug,
        summary,
        visibility,
        content,
        featured_image_id,
        status,
        post_id,
      } = values;

      const postToSave: Partial<PostInsert> = {
        title,
        slug,
        summary,
        visibility,
        content,
        featured_image_id,
        status,
        post_id,
      };

      try {
        mutate(postToSave as PostInsert),
          setLastUpdate(data?.lastUpdate as Date);
      } catch (error) {
        console.error("Error saving post:", error);
      }
    },
  });

  const [categories, setCategories] = useState<{ name: string; id?: number }[]>(
    []
  );
  const [tags, setTags] = useState<{ name: string }[]>([]);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const updatePost = useCallback(
    (updates: Partial<PostInsert>) =>
      formik.setValues({ ...formik.values, ...updates }),
    []
  );

  useEffect(() => {
    if (
      (formik.values?.title as string)?.length > 0 &&
      (formik.values?.title as string)?.length <= 60
    ) {
      const generatedSlug = slugify(formik.values.title + "-" + randomNumId, {
        lower: true,
        strict: true,
      });
      updatePost({ slug: generatedSlug });
    }
  }, [formik.values.title, randomNumId]);

  const handleContentChange = (content: {
    html?: string;
    markdown: string;
    text: string;
  }) => {
    console.log(content);

    updatePost({ content: content.html });
    if (content.text.length <= META_DESCRIPTION_LENGTH) {
      updatePost({ summary: content.text });
    }
  };
  const getEditorCounts = (counts: { words: number; characters: number }) => {
    setEditorCounts(counts);
  };
  const debouncedSubmit = useRef(
    debounce(() => {
      formik.handleSubmit();
    }, 500) // 500ms debounce
  ).current;

  useEffect(() => {
    debouncedSubmit();

    return () => {
      debouncedSubmit.cancel();
    };
  }, [formik.values]);
  return (
    <Box h="full" overflowY={"auto"}>
      <DashHeader pos="sticky" top={0} zIndex={10}>
        <Stack gap={0}>
          <Text fontSize={"2xl"} fontWeight={600} as="span">
            Create Post
          </Text>
          <Text as="span" fontSize="sm" color={"gray.500"}>
            Last updated:{" "}
            {lastUpdate
              ? formatDate(new Date(lastUpdate as Date))
              : "Not saved yet"}
          </Text>
        </Stack>
        <Button
          variant={"outline"}
          gap={2}
          size={"sm"}
          rounded={"full"}
          onClick={onOpen}
          display={{ base: "flex", lg: "none" }}
        >
          <LuSettings />
          <Text hideBelow={"md"}>Post Settings</Text>
        </Button>
      </DashHeader>

      <Flex gap={3} py={4} px={{ base: 2, md: 3 }}>
        <Stack
          minH={"100%"}
          h={"calc(var(--chakra-vh) - (var(--dash-header-h) + 32px))"}
          flex={1}
          minW={{ base: 300, md: 350 }}
          pos="sticky"
          top={"calc(var(--dash-header-h) + 16px)"}
          width={{ base: "100%" }}
          bg={useColorModeValue("white", "gray.900")}
          border={"1px"}
          borderColor={borderColor}
          overflowY={"hidden"}
          rounded={"26px"}
          boxShadow={"var(--card-raised)"}
        >
          {/* <TitleInput formik={formik} /> */}
          <Box
            borderBottom={"1px"}
            borderBottomColor={borderColor}
            p={1}
            py={2}
          >
            <Input
              border={"none"}
              outline={"none"}
              autoComplete="off"
              placeholder="Awesome title"
              name={"title"}
              value={formik.values.title as string}
              fontWeight={600}
              onChange={(e) => updatePost({ title: e.target.value })}
              rounded={"none"}
              _focus={{ boxShadow: "none" }}
              fontSize={{ base: "lg", md: "24px" }}
            />
          </Box>
          <TextEditor
            getCounts={getEditorCounts}
            onContentChange={(content) => handleContentChange(content)}
            initialValue={formik.values.content || ""}
          />
        </Stack>

        <Box display={{ base: "none", lg: "block" }} maxW={280}>
          <SidebarContent
            formik={formik}
            updatePost={updatePost}
            categories={categories}
            setCategories={setCategories}
            tags={tags}
            setTags={setTags}
            onPublish={() => {
              updatePost({ status: "published" });
              formik.handleSubmit();
            }}
            onDraft={() => {
              updatePost({ status: "draft" });
              formik.handleSubmit();
            }}
            isSaving={isSaving}
            editorCounts={editorCounts}
          />
        </Box>
      </Flex>

      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="xs">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Post Settings</DrawerHeader>
          <DrawerBody px={2}>
            <SidebarContent
              formik={formik}
              updatePost={updatePost}
              categories={categories}
              setCategories={setCategories}
              tags={tags}
              setTags={setTags}
              isSaving={isSaving}
              editorCounts={editorCounts}
              onPublish={() => {
                updatePost({ status: "published" });
                formik.handleSubmit();
              }}
              onDraft={() => {
                updatePost({ status: "draft" });
                formik.handleSubmit();
              }}
            />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
}
