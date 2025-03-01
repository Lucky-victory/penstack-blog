"use client";
import {
  HStack,
  Text,
  useBreakpointValue,
  useColorModeValue,
} from "@chakra-ui/react";
import { AppLogo } from "./AppLogo";
import { useSiteConfig } from "@/src/context/SiteConfig";

interface Props {
  logoSize?: string;
  nameSize?: string;
  isFooter?: boolean;
  logoBg?: string;
}
export const AppLogoAndName = ({
  logoSize = "40px",
  nameSize = "md",
  isFooter = false,
  logoBg = "inherit",
}: Props) => {
  const textColor = useColorModeValue("inherit", "inherit");
  const siteSettings = useSiteConfig();
  const logo = useBreakpointValue({
    base: siteSettings?.siteMobileLogo?.value || siteSettings?.siteLogo?.value,
    md: siteSettings?.siteLogo?.value,
  });
  const defaultLogoSize = useBreakpointValue({
    base: "50px",
    md: "40px",
  });
  return (
    <HStack>
      <AppLogo bg={logoBg} size={logoSize || defaultLogoSize!} src={logo!} />
      {!isFooter && siteSettings.showSiteNameWithLogo.enabled && (
        <Text
          fontSize={nameSize}
          fontWeight="medium"
          color={textColor}
          isTruncated
        >
          {siteSettings?.siteName?.value}
        </Text>
      )}
    </HStack>
  );
};
