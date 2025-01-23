import React, { useCallback, useState } from "react";
import { NodeViewContent, NodeViewProps, NodeViewWrapper } from "@tiptap/react";
import {
  LuAlignLeft,
  LuAlignCenter,
  LuAlignRight,
  LuAlignJustify,
  LuTrash2,
  LuImage,
  LuGripVertical,
} from "react-icons/lu";
import { MediaResponse } from "@/src/types";
import { Image } from "@chakra-ui/react";

interface MediaComponentProps extends NodeViewProps {
  isRendering?: boolean;
}

const sizeToWidth = {
  small: "300px",
  large: "600px",
  full: "100%",
};

export const MediaComponent: React.FC<MediaComponentProps> = ({
  node,
  updateAttributes,
  deleteNode,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [dimensions, setDimensions] = useState({
    width:
      node.attrs.width ||
      sizeToWidth[node.attrs.size as keyof typeof sizeToWidth],
    height: node.attrs.height || "auto",
  });

  const handleResizeStart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setStartPos({ x: e.clientX, y: e.clientY });
  };

  const handleResize = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;

      const deltaX = e.clientX - startPos.x;
      const currentWidth = parseFloat(dimensions.width);
      const newWidth = Math.max(200, currentWidth + deltaX);

      setDimensions((prev) => ({
        ...prev,
        width: `${newWidth}px`,
      }));

      updateAttributes({ width: `${newWidth}px` });
    },
    [isDragging, startPos, dimensions, updateAttributes]
  );

  const handleResizeEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  React.useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleResize);
      window.addEventListener("mouseup", handleResizeEnd);
      return () => {
        window.removeEventListener("mousemove", handleResize);
        window.removeEventListener("mouseup", handleResizeEnd);
      };
    }
  }, [isDragging, handleResize, handleResizeEnd]);

  const handleAlign = (position: string) => {
    updateAttributes({ position });
  };

  if (!node.attrs.url) {
    return (
      <NodeViewWrapper>
        <div className="flex items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-lg">
          <button
            onClick={() => {
              /* Implement media modal open */
            }}
            className="px-4 py-2 text-sm font-medium text-brand-600 bg-brand-50 rounded-md hover:bg-brand-100"
          >
            <LuImage className="w-4 h-4 mr-2 inline-block" />
            Insert Media
          </button>
        </div>
      </NodeViewWrapper>
    );
  }

  return (
    <NodeViewWrapper>
      <div className="group relative" style={{ width: dimensions.width }}>
        {/* Floating Toolbar */}
        <div className="absolute -top-10 left-0 hidden group-hover:flex items-center gap-2 bg-white shadow-lg rounded-lg p-2 z-50">
          <button
            onClick={() => handleAlign("left")}
            className={`p-1 rounded hover:bg-gray-100 ${node.attrs.position === "left" ? "bg-gray-200" : ""}`}
          >
            <LuAlignLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleAlign("center")}
            className={`p-1 rounded hover:bg-gray-100 ${node.attrs.position === "center" ? "bg-gray-200" : ""}`}
          >
            <LuAlignCenter className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleAlign("right")}
            className={`p-1 rounded hover:bg-gray-100 ${node.attrs.position === "right" ? "bg-gray-200" : ""}`}
          >
            <LuAlignRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleAlign("inline")}
            className={`p-1 rounded hover:bg-gray-100 ${node.attrs.position === "inline" ? "bg-gray-200" : ""}`}
          >
            <LuAlignJustify className="w-4 h-4" />
          </button>
          <div className="w-px h-4 bg-gray-200" />
          <button
            onClick={() => deleteNode()}
            className="p-1 rounded hover:bg-red-100 text-red-600"
          >
            <LuTrash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Media Content */}
        <div className="relative">
          {node.attrs.type === "image" ? (
            <Image
              src={node.attrs.url}
              alt={node.attrs.alt}
              className="w-full h-auto object-cover"
              style={{ height: dimensions.height }}
            />
          ) : (
            <div className="aspect-w-16 aspect-h-9">
              <video controls className="w-full h-full">
                <source src={node.attrs.url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          )}

          {/* Resize Handle */}
          <div
            className="absolute bottom-0 right-0 w-6 h-6 cursor-se-resize opacity-0 group-hover:opacity-100"
            onMouseDown={handleResizeStart}
          >
            <LuGripVertical className="w-4 h-4 text-gray-500" />
          </div>
        </div>
      </div>
    </NodeViewWrapper>
  );
};
