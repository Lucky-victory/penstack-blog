import { Button, useToast } from "@chakra-ui/react";
import { PermissionGuard } from "../../../PermissionGuard";
import { useState } from "react";
import { useEditorPostManagerStore } from "@/src/state/editor-post-manager";

export const ActionButtons = () => {
  const [isPublishing, setIsPublishing] = useState<boolean>(false);
  const toast = useToast({
    duration: 3000,
    status: "success",
    position: "top",
  });
  const updateField = useEditorPostManagerStore((state) => state.updateField);
  function onDraft() {
    updateField("status", "draft");
  }
  function onPublish() {
    setIsPublishing(true);
    updateField("status", "published");
  }
  function onDelete() {
    updateField("status", "deleted");
  }
  return (
    <>
      <PermissionGuard requiredPermission="posts:delete">
        <Button
          size="xs"
          flex={1}
          rounded="md"
          variant="ghost"
          colorScheme="red"
          color="red.500"
          bg="red.100"
          onClick={onDelete}
        >
          Delete
        </Button>
      </PermissionGuard>
      <Button
        size="xs"
        flex={1}
        variant="outline"
        rounded="md"
        onClick={onDraft}
      >
        Save draft
      </Button>
      <PermissionGuard requiredPermission="posts:publish">
        <Button
          size="xs"
          isDisabled={isPublishing}
          isLoading={isPublishing}
          loadingText="Publishing..."
          flex={1}
          rounded="md"
          onClick={onPublish}
        >
          Publish
        </Button>
      </PermissionGuard>
    </>
  );
};
