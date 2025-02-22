"use client";
import { HStack, Text, useColorModeValue } from "@chakra-ui/react";
import { AppLogo } from "./AppLogo";
import { useSiteConfig } from "@/src/context/SiteConfig";

interface Props {
  logoSize?: string;
  nameSize?: string;isFooter?:boolean
}
export const AppLogoAndName = ({
  logoSize = "30px",
  nameSize = "md",isFooter=false
}: Props) => {
  const textColor = useColorModeValue("inherit", "inherit");
  const siteSettings = useSiteConfig();
  return (
    <HStack>
      <AppLogo size={logoSize} src={siteSettings?.siteLogo?.value} />
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
