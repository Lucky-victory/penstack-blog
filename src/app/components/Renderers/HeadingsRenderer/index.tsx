import { Link } from "@chakra-ui/next-js";
import { As, Heading } from "@chakra-ui/react";
import { NodeViewProps, NodeViewWrapper } from "@tiptap/react";
import { memo, PropsWithChildren, ReactNode, useMemo } from "react";

interface HeadingsRendererProps {
  isEditing?: boolean;
  node: Partial<NodeViewProps["node"]>;
  content?: ReactNode;
}
export const PenstackHeadingsRenderer: React.FC<HeadingsRendererProps> = memo(
  ({ isEditing = true, node, content }) => {
    const styles: Record<string, Record<string, any>> = useMemo(
      () => ({
        h1: {
          size: "3xl",
          as: "h1",
          mt: 8,
          mb: 6,
        },
        h2: {
          size: "xl",
          as: "h2",
          mt: 6,
          mb: 5,
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

    const heading = (
      <Heading
        {...node?.attrs}
        as={("h" + node?.attrs?.level) as As}
        {...styles[("h" + node?.attrs?.level) as any]}
      >
        {isEditing ? node?.firstChild?.text : content}
      </Heading>
    );
    return (
      <>
        {isEditing ? (
          <NodeViewWrapper>{heading}</NodeViewWrapper>
        ) : (
          <Link href={`#${node?.attrs?.id}`} color={"inherit"}>
            {heading}
          </Link>
        )}
      </>
    );
  }
);

PenstackHeadingsRenderer.displayName = "PenstackHeadingsRenderer";
