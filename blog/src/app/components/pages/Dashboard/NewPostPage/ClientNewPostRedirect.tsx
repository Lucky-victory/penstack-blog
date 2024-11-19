"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Stack } from "@chakra-ui/react";
import Loader from "../../../Loader";

interface ClientNewPostRedirectProps {
  postId: string;
}

export function ClientNewPostRedirect({ postId }: ClientNewPostRedirectProps) {
  const router = useRouter();

  useEffect(() => {
    router.replace(`/dashboard/posts/new/${postId}`);
  }, [postId, router]);

  return (
    <Stack h={"full"} align={"center"} justify={"center"}>
      <Loader />
    </Stack>
  );
}
