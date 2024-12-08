import { Button } from "@chakra-ui/react";
import { Editor } from "@tiptap/react";
import { LuSearch } from "react-icons/lu";

export const PostCardButton = ({ editor }: { editor: Editor }) => {
  return (
    <Button
      size="sm"
      leftIcon={<LuSearch />}
      onClick={() => editor.commands.insertPostCard()}
    >
      Insert Post Card
    </Button>
  );
};
