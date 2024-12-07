import { Menu, MenuButton, Button, MenuList } from "@chakra-ui/react";
import { Editor } from "@tiptap/react";
import { useState } from "react";
import { LuSearch } from "react-icons/lu";
import { PostSearch } from "./PostSearch";

export const PostCardButton = ({ editor }: { editor: Editor }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Menu isOpen={isOpen} onClose={() => setIsOpen(false)}>
      <MenuButton
        as={Button}
        size="sm"
        leftIcon={<LuSearch />}
        onClick={() => setIsOpen(true)}
      >
        Insert Post Card
      </MenuButton>
      <MenuList p={4} width="300px">
        <PostSearch
          onSelect={(post) => {
            editor.commands.insertPostCard(post.post_id as string);
            setIsOpen(false);
          }}
        />
      </MenuList>
    </Menu>
  );
};
