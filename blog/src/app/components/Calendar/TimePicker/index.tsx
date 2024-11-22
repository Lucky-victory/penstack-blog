import { Box, HStack, Stack, Text } from "@chakra-ui/react";
import { TimePicker as ReactTimePicker } from "react-time-picker";

export const TimePicker = ({
  value,
  onChange,
}: {
  value: string | Date;
  onChange: (value: string | null) => void;
}) => {
  return (
    <HStack alignSelf={"flex-end"} mb={2}>
      <Text as={"span"} fontWeight={500} color="gray.600">
        Time:
      </Text>
      <Box
        sx={{
          ".react-time-picker__wrapper": { display: "flex" },
          input: {
            border: 0,
            outline: "none",
            backgroundColor: "transparent",
            color: "gray.500",
            fontWeight: "bold",
            fontSize: "14px",
            fontFamily: "inherit",
            width: "100%",
            "&:focus": {
              outline: "none",
              boxShadow: "none",
              border: "none",
              backgroundColor: "transparent",
            },
            "&:hover": {
              backgroundColor: "transparent",
              color: "gray.500",
              border: "none",
              boxShadow: "none",
            },
            "&:active": {
              backgroundColor: "transparent",
              color: "gray.500",
              border: "none",
              boxShadow: "none",
            },
            "&:focus-visible": {
              outline: "none",
              boxShadow: "none",
              border: "none",
              backgroundColor: "transparent",
            },
            "&:focus-within": {
              outline: "none",
              boxShadow: "none",
              border: "none",
              backgroundColor: "transparent",
            },
          },
        }}
        as={ReactTimePicker}
        px={2}
        display={"flex"}
        rounded={"full"}
        value={value}
        ring={1}
        format="h:mm a"
        onChange={onChange}
        clockIcon={null}
        clearIcon={null}
        shouldOpenClock={() => false}
      />
    </HStack>
  );
};
