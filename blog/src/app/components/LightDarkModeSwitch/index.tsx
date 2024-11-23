import { IconButton, useColorMode, useColorModeValue } from "@chakra-ui/react";
import { LuMoon, LuSun } from "react-icons/lu";

export const LightDarkModeSwitch = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  const hoverBgColor = useColorModeValue("gray.50", "gray.700");
  return (
    <>
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
    </>
  );
};
