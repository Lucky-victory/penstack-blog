import { CardHeader, HStack, Heading } from "@chakra-ui/react";

import { FC, PropsWithChildren } from "react";

export const PageTitleHeader: FC<PropsWithChildren<{ title: string }>> = ({
  title,
  children,
}) => {
  return (
    <CardHeader>
      <HStack justify="space-between" align="center">
        <Heading size="md">{title}</Heading>
        {children}
      </HStack>
    </CardHeader>
  );
};
