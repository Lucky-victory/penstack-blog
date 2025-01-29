import React, { useCallback, useState, useEffect } from "react";
import { Resizable } from "react-resizable";
import {
  BubbleMenu,
  NodeViewContent,
  NodeViewProps,
  NodeViewWrapper,
} from "@tiptap/react";
import {
  LuAlignLeft,
  LuAlignCenter,
  LuAlignRight,
  LuAlignJustify,
  LuTrash2,
  LuImage,
} from "react-icons/lu";
import { Image } from "@chakra-ui/react";
// import "react-resizable/css/styles.css";

interface MediaComponentProps extends NodeViewProps {
  isEditing?: boolean;
}
const sizeToWidth = {
  small: 300,
  large: 600,
  full: "100%",
  custom: null,
};

type MediaSize = keyof typeof sizeToWidth;

export const MediaComponent: React.FC<MediaComponentProps> = ({
  node,
  updateAttributes,
  deleteNode,
  selected,
  editor,
  isEditing = true,
}) => {
  const [aspectRatio, setAspectRatio] = useState<number>(1);
  const [isHovered, setIsHovered] = useState(false);

  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    if (img.naturalWidth && img.naturalHeight) {
      setAspectRatio(img.naturalWidth / img.naturalHeight);
    }
  };

  const handleResize = useCallback(
    (event: any, { size, handle }: any) => {
      const isCorner = ["se", "sw", "ne", "nw"].includes(handle);
      let newWidth = size.width;
      let newHeight = size.height;

      if (isCorner && node.attrs.type === "image") {
        newHeight = Math.round(newWidth / aspectRatio);
      }

      updateAttributes({
        width: newWidth,
        height: newHeight,
        size: "custom" as MediaSize,
      });
    },
    [aspectRatio, node.attrs.type, updateAttributes]
  );

  const currentWidth =
    node.attrs.size === "full"
      ? "100%"
      : node.attrs.width || sizeToWidth[node.attrs.size as MediaSize];

  const widthValue =
    typeof currentWidth === "string" ? currentWidth : `${currentWidth}px`;

  const heightValue = node.attrs.height ? `${node.attrs.height}px` : "auto";

  const alignmentClasses = {
    left: "ml-0 mr-auto",
    center: "mx-auto",
    right: "ml-auto mr-0",
    inline: "w-full",
  };

  const alignmentClass =
    alignmentClasses[node.attrs.position as keyof typeof alignmentClasses] ||
    alignmentClasses.inline;
  const ResizerHandle = React.forwardRef((props, ref) => {
    const { handleAxis, ...restProps } = props as any;
    return (
      <div
        ref={ref}
        className={`react-resizable-handle handle-${handleAxis} react-resizable-handle-${handleAxis} bg-blue-500 transition-opacity duration-200 ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
        // style={{ width: 14, height: 14 }}
        {...restProps}
      />
    );
  });
  ResizerHandle.displayName = "ResizerHandle";
  return (
    <NodeViewWrapper
      className={`relative my-4 ${alignmentClass}`}
      style={{ width: widthValue }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Floating Toolbar */}
      {
        <BubbleMenu
          editor={editor}
          shouldShow={(props) => props.editor.isActive("media")}
        >
          <div className="flex items-center gap-2 bg-white shadow-lg rounded-lg p-2">
            <button
              onClick={() => updateAttributes({ position: "left" })}
              className={`p-1 rounded hover:bg-gray-100 ${node.attrs.position === "left" ? "bg-gray-200" : ""}`}
            >
              <LuAlignLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => updateAttributes({ position: "center" })}
              className={`p-1 rounded hover:bg-gray-100 ${node.attrs.position === "center" ? "bg-gray-200" : ""}`}
            >
              <LuAlignCenter className="w-4 h-4" />
            </button>
            <button
              onClick={() => updateAttributes({ position: "right" })}
              className={`p-1 rounded hover:bg-gray-100 ${node.attrs.position === "right" ? "bg-gray-200" : ""}`}
            >
              <LuAlignRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => deleteNode()}
              className="p-1 rounded hover:bg-red-100 text-red-600"
            >
              <LuTrash2 className="w-4 h-4" />
            </button>
          </div>
        </BubbleMenu>
      }

      {/* Resizable Media Content */}
      {node.attrs.size !== "full" ? (
        <Resizable
          width={Number(currentWidth)}
          height={node.attrs.height || aspectRatio * Number(currentWidth)}
          onResize={handleResize}
          lockAspectRatio={node.attrs.type === "image"}
          handle={<ResizerHandle />}
          // handleSize={[14, 14]}
          resizeHandles={["se", "sw", "ne", "nw"]}
        >
          <div
            className={`relative w-full h-full ${selected ? "resizer-selected" : ""}`}
          >
            {node.attrs.type === "image" ? (
              <Image
                src={node.attrs.url}
                alt={node.attrs.alt}
                className="w-full h-full object-contain rounded-lg"
                onLoad={handleLoad}
                style={{ height: heightValue }}
              />
            ) : (
              <video
                controls
                className="w-full h-full rounded-lg"
                style={{ height: heightValue }}
              >
                <source src={node.attrs.url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
          </div>
        </Resizable>
      ) : (
        <Image
          src={node.attrs.url}
          alt={node.attrs.alt}
          className="w-full h-auto object-contain rounded-lg"
          onLoad={handleLoad}
        />
      )}
    </NodeViewWrapper>
  );
};
