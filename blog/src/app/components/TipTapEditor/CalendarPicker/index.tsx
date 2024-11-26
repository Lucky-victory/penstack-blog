import { ReactNode, useRef, useState } from "react";
import Calendar from "../../Calendar";
import {
  Button,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  useOutsideClick,
  useToast,
} from "@chakra-ui/react";
import { useCustomEditorContext } from "@/src/context/AppEditor";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { CronJobPayload } from "@/src/lib/cron";
import { dateTimeToCronJobSchedule } from "@/src/lib/cron/helper";

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
  const { updateField, activePost } = useCustomEditorContext();
  const toast = useToast({
    duration: 3000,
    isClosable: true,
    position: "top",
  });
  const { mutateAsync } = useMutation({
    mutationFn: async (bodyData: CronJobPayload) => {
      const { data } = await axios.post("/api/cron", bodyData);
      console.log({ data });
      return data?.data;
    },
  });
  function onDone(date: Date) {
    onClose();
    const payload: CronJobPayload = {
      job: {
        url: "/api/schedules/auto-publish",
        enabled: true,
        title: activePost?.title || "",
        schedule: dateTimeToCronJobSchedule(new Date(date)),
        saveResponses: true,
        requestMethod: "POST",
        extendedData: {
          body: JSON.stringify({
            post_id: activePost?.post_id,
          }),
        },
      },
    };
    mutateAsync(payload).then((result) => {
      updateField("scheduled_at", date);
      updateField("schedule_id", result?.jobId);
      toast({ title: result?.message });
    });
  }
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
