import { Button } from "@chakra-ui/react";
import { Editor } from "@tiptap/react";
import { LuImage } from "react-icons/lu";

export const MediaButton = ({ editor }: { editor: Editor }) => {
  return (
    <Button
      size="sm"
      leftIcon={<LuImage />}
      variant={editor.isActive("media") ? "solid" : "outline"}
      onClick={() => editor.commands.insertMedia({})}
    >
      Insert Media
    </Button>
  );
};
