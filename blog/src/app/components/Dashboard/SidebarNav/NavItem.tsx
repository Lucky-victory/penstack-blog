import { Flex, Icon, Link } from "@chakra-ui/react";
import { PermissionGuard } from "../../PermissionGuard";
import { TPermissions } from "@/src/types";
import { ElementType, ReactNode } from "react";
import { usePathname } from "next/navigation";

export const SidebarNavItem = ({
  icon,
  children,
  href,
  nested = false,
  permission,
  label,
  isMinimized,
  onClose,
  navBtnBg,
  navBtnBgHover,
  textColor,
  hoverTextColor,
  navBtnActiveColor,
  bg,
}: {
  icon?: ElementType;
  children: ReactNode;
  href: string;
  nested?: boolean;
  label?: string;
  permission?: TPermissions;
  isMinimized?: boolean;
  onClose?: () => void;
  navBtnBg: string;
  navBtnBgHover: string;
  textColor: string;
  hoverTextColor: string;
  navBtnActiveColor: string;
  bg: string;
}) => {
  const pathname = usePathname();
  const isActive =
    pathname === href ||
    (href.includes("/dashboard/posts/new") && pathname.match(href + "/*"));

  const content = (
    <Link
      display={"flex"}
      variant="unstyled"
      fontWeight={"500"}
      pos={"relative"}
      gap={4}
      pl={isMinimized ? 3 : 5}
      href={href}
      style={{ textDecoration: "none" }}
      onClick={onClose}
      _hover={{
        _before: {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          width: "4px",
          shadow: "md",
          height: "100%",
          backgroundColor: navBtnBgHover,
          borderRadius: "1px",
          transition: "background-color 0.2s ease-in-out",
        },
      }}
      _after={{
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        width: "4px",
        shadow: "md",
        height: "100%",
        backgroundColor: navBtnBg,
        borderRadius: "1px",
        transition: "background-color 0.2s ease-in-out",
        visibility: isActive ? "visible" : "hidden",
      }}
    >
      <Flex
        rounded={"md"}
        align={"center"}
        justify={isMinimized ? "center" : "flex-start"}
        gap={4}
        color={isActive ? navBtnActiveColor : textColor}
        py={nested ? "6px" : "8px"}
        px={isMinimized ? 2 : nested ? 3 : 4}
        fontSize={nested ? "small" : "15px"}
        flex={1}
        letterSpacing={0.5}
        bg={isActive ? navBtnBg : "transparent"}
        _hover={{
          bg: navBtnBgHover,
          color: isActive ? navBtnActiveColor : hoverTextColor,
        }}
      >
        {icon && <Icon fontSize="16" as={icon} color={"inherit"} />}
        {label && label}
        {!isMinimized && children}
      </Flex>
    </Link>
  );

  if (permission) {
    return (
      <PermissionGuard requiredPermission={permission} showLoader={false}>
        {content}
      </PermissionGuard>
    );
  }
  return content;
};
