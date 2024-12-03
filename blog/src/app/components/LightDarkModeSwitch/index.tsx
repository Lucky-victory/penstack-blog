import {
  Button,
  HStack,
  IconButton,
  Text,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import { LuMoon, LuSun } from "react-icons/lu";

export const LightDarkModeSwitch = ({ showLabel }: { showLabel?: boolean }) => {
  const { colorMode, toggleColorMode } = useColorMode();

  const hoverBgColor = useColorModeValue("gray.100", "gray.700");
  return (
    <HStack ml={"2px"}>
      {!showLabel && (
        <IconButton
          aria-label="Toggle color mode"
          colorScheme="black"
          icon={
            colorMode === "light" ? <LuMoon size={20} /> : <LuSun size={20} />
          }
          onClick={toggleColorMode}
          variant="ghost"
          _hover={{ bg: hoverBgColor }}
          rounded={"full"}
        />
      )}
      {showLabel && (
        <Button
          colorScheme="black"
          fontWeight={400}
          leftIcon={
            colorMode === "light" ? <LuMoon size={20} /> : <LuSun size={20} />
          }
          onClick={toggleColorMode}
          variant="ghost"
          _hover={{ bg: hoverBgColor }}
          rounded={"full"}
        >
          {" "}
          <Text as="span">Toggle Mode</Text>{" "}
        </Button>
      )}
    </HStack>
  );
};
