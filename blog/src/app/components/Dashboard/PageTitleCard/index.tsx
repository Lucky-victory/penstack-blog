import { Card, CardBody, HStack, Heading } from "@chakra-ui/react";

import { FC, PropsWithChildren } from "react";

export const PageTitleCard: FC<PropsWithChildren<{ title: string }>> = ({
  title,
  children,
}) => {
  return (
    <Card rounded={"lg"} mb={5}>
      <CardBody px={{ base: 3, lg: 4 }}>
        <HStack justify="space-between" align="center">
          <Heading size="lg">{title}</Heading>
          {children}
        </HStack>
      </CardBody>
    </Card>
  );
};
