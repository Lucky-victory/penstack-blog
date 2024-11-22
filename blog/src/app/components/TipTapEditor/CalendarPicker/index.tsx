import { ReactNode, useRef, useState } from "react";
import Calendar from "../../Calendar";
import {
  Button,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  useOutsideClick,
} from "@chakra-ui/react";

export const CalendarPicker = ({
  onDateSelect,
  onCancel,
  onDone,
  defaultValue,
  isOpen,
  onClose,
  trigger,
}: {
  onDateSelect: (date: Date) => void;
  onCancel?: () => void;
  onDone?: (date: Date) => void;
  defaultValue?: Date;
  isOpen: boolean;
  onClose: () => void;
  trigger: ReactNode;
}) => {
  const popRef = useRef(null);
  useOutsideClick({
    ref: popRef,
    handler: onClose,
  });
  return (
    <>
      <Popover isOpen={isOpen} onClose={onClose}>
        <PopoverTrigger>{trigger}</PopoverTrigger>
        <PopoverContent
          ref={popRef}
          border={0}
          p={0}
          rounded={"2xl"}
          _dark={{ bg: "#1a202c" }}
        >
          <PopoverBody>
            <Calendar
              onDateSelect={onDateSelect}
              onCancel={onCancel}
              onDone={onDone}
              defaultValue={defaultValue}
            />
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </>
  );
};
