import PenstackBlockquoteRenderer from "@/src/app/components/Renderers/PenstackBlockquoteRenderer";
import { NodeViewProps } from "@tiptap/core";
import { NodeViewWrapper } from "@tiptap/react";
import { memo, useState } from "react";

interface PenstackBlockquoteComponentProps extends NodeViewProps {
  variant: "default" | "warning" | "info" | "success" | "danger";
  isEditing?: boolean;
}
export const PenstackBlockquoteComponent: React.FC<
  PenstackBlockquoteComponentProps
> = ({ node, updateAttributes }) => {
  return (
    <NodeViewWrapper>
      <PenstackBlockquoteRenderer
        isEditing
        node={node}
        updateAttributes={updateAttributes}
        variant={node?.attrs?.variant}
      />
    </NodeViewWrapper>
  );
};
export default memo(PenstackBlockquoteComponent);
