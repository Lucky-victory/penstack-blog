"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
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
  debounce,
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
import { useParams, useRouter } from "next/navigation";
import Loader from "../../Loader";

const META_DESCRIPTION_LENGTH = 155;

export default function NewPostPage() {
  const postId = useParams().postId as string;
  const { post, loading } = usePost(postId);

  console.log({ post, postId });

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
  const [isSaving, setIsSaving] = useState(false);
  const { queryParams, setQueryParam } = useQueryParams();
  const borderColor = useColorModeValue("gray.300", "gray.700");

  // console.log({queryParams});
  const randomNumId = useMemo(
    () => shortIdGenerator.bigIntId().substring(6, 12),
    []
  );
  const { author, ...postWithoutAuthor } = nullToEmptyString(post!);
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: postWithoutAuthor as PostInsert,
    onSubmit: async (values) => {
      setIsSaving(true);
      const {
        title,
        slug,
        summary,
        visibility,
        content,
        featured_image,
        status,
        post_id,
        updated_at,
      } = values;

      const postToSave: PostInsert = {
        title,
        slug,
        summary,
        visibility,
        content,
        featured_image,
        status,
        post_id,
        author_id: 4,
      };

      try {
        const response = await fetch("/api/posts/" + post_id, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(postToSave),
        });
        const data = await response.json();
        console.log({ data });
        setLastUpdate(data?.lastUpdate);

        setIsSaving(false);
        return data;
      } catch (error) {
        setIsSaving(false);
        return null;
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
  }, [formik.values.title, randomNumId, updatePost]);

  const handleContentChange = (content: {
    html?: string;
    markdown: string;
    text: string;
  }) => {
    console.log(content);

    updatePost({ content: content.markdown });
    if (content.text.length <= META_DESCRIPTION_LENGTH) {
      updatePost({ summary: content.text });
    }
  };
  const getEditorCounts = (counts: { words: number; characters: number }) => {
    setEditorCounts(counts);
  };

  useEffect(() => {
    console.log({ ...formik.values });
    // debouncedSavePost();
    formik.handleSubmit();
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
          <TitleInput formik={formik} />
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
