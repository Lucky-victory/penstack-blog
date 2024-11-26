import {
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import timezones from "@/src/lib/timezones.json";
import { memo, useEffect, useState } from "react";
import { LuChevronDown } from "react-icons/lu";
const TimezonePicker = ({
  onChange,
  defaultValue = Intl.DateTimeFormat().resolvedOptions().timeZone,
}: {
  onChange: (timezone: string) => void;
  defaultValue?: string;
}) => {
  const [selectedTimezone, setSelectedTimezone] = useState(defaultValue);
  const handleChange = (timezone: string) => {
    setSelectedTimezone(timezone);
  };

  useEffect(() => {
    onChange(selectedTimezone);
  }, [selectedTimezone]);
  return (
    <Stack gap={0}>
      <Text
        fontSize={"sm"}
        fontWeight={500}
        as={"span"}
        color={useColorModeValue("gray.500", "gray.400")}
      >
        Timezone:
      </Text>
      <Menu>
        <MenuButton
          as={Button}
          size={"sm"}
          variant={"outline"}
          rounded={"full"}
          rightIcon={<LuChevronDown />}
        >
          {" "}
          {selectedTimezone ? selectedTimezone : "Select timezone"}
        </MenuButton>
        <MenuList maxH={250} overflowY={"auto"} px={2}>
          {timezones.map((timezone, index) => {
            return (
              <MenuItem
                value={timezone}
                rounded={"full"}
                bg={selectedTimezone === timezone ? "blue.500" : ""}
                color={selectedTimezone === timezone ? "white" : ""}
                key={index}
                onClick={() => handleChange(timezone)}
              >
                {timezone}
              </MenuItem>
            );
          })}
        </MenuList>
      </Menu>
    </Stack>
  );
};
export default memo(TimezonePicker);
