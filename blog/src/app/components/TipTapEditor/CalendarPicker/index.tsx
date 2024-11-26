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
import { useCustomEditorContext } from "@/src/context/AppEditor";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export const CalendarPicker = ({
  defaultValue,
  isOpen,
  onClose,
  trigger,
}: {
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
  const { updateField } = useCustomEditorContext();
  const { mutate } = useMutation({
    mutationFn: async (bodyData) => {
      const { data } = await axios.post("/api/cron/schedule", bodyData);
    },
  });
  async function onDone(date: Date) {}
  function onCancel() {}
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
