import React, { useRef } from "react";
import { VStack, Box, Portal } from "@chakra-ui/react";
import { Button } from '@/src/app/components/ui/Button';
import { Editor, Range } from "@tiptap/react";
import { Menu,MenuButton,MenuList,MenuItem } from '@/src/app/components/ui/Menu';

interface CommandListItem {
  title: string;
  command: (props: { editor: Editor; range: Range }) => void;
}

interface SlashCommandListProps {
  items: CommandListItem[];
  command: (item: CommandListItem) => void;
  clientRect: () => DOMRect;isOpen:boolean,onOpen:()=>void,onClose:()=>void
}

export const SlashCommandList: React.FC<SlashCommandListProps> = ({ items, command, clientRect,isOpen,onOpen,onClose }) => {
  const rect = clientRect();
  const ref=useRef(null)
  return (

    <Menu isOpen={isOpen} onClose={onClose} onOpen={onOpen} placement="bottom-start"  >
      {/* <MenuButton as={Box} position="absolute" top={`${rect.top + 10}px`} left={`${rect.left}px`} /> */}
      <MenuList >
        {items.map((item, index) => (
          <MenuItem
            
            key={index}
            onClick={() => command(item)}
          >
            {item.title}
          </MenuItem>
        ))}
      </MenuList>
    </Menu>          
   
        
  );
};