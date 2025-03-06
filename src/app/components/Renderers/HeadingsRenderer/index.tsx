import { Link } from "@chakra-ui/next-js";
import { As, Heading } from "@chakra-ui/react";
import { NodeViewWrapper } from "@tiptap/react";
import { memo, PropsWithChildren, useMemo } from "react";

interface HeadingsRendererProps {
  isEditing?: boolean;
  attrs: { as: As } & Record<string, any>;
}
export const PenstackHeadingsRenderer: React.FC<
  PropsWithChildren<HeadingsRendererProps>
> = memo(({ attrs, children, isEditing }) => {
  const styles: Record<string, Record<string, any>> = useMemo(
    () => ({
      h1: {
        size: "3xl",
        as: "h1",
        mt: 8,
        mb: 4,
      },
      h2: {
        size: "xl",
        as: "h2",
        mt: 6,
        mb: 4,
      },
      h3: {
        size: "lg",
        as: "h3",
        mt: 4,
        mb: 2,
      },
      h4: {
        size: "md",
        as: "h4",
        mb: 2,
      },
      h5: {
        size: "sm",
        as: "h5",
        mb: 2,
      },
      h6: {
        size: "xs",
        as: "h6",
        mb: 2,
      },
    }),
    []
  );
  console.log({ attrs }, "from PenstackHeadingsRenderer");

  const heading = (
    <Heading {...attrs} {...styles[attrs.as as any]}>
      {children}
    </Heading>
  );
  return (
    <>
      {isEditing ? (
        <NodeViewWrapper>{heading}</NodeViewWrapper>
      ) : (
        <Link href={`#${attrs?.id}`} color={"inherit"}>
          {heading}
        </Link>
      )}
    </>
  );
});

PenstackHeadingsRenderer.displayName = "PenstackHeadingsRenderer";
