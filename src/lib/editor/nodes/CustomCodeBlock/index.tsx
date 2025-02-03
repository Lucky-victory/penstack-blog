import { NodeViewContent, NodeViewWrapper } from "@tiptap/react";
import React, { memo } from "react";
import styles from "./CodeBlock.module.css";
import { Select, useClipboard } from "@chakra-ui/react";
import { NodeViewProps } from "@tiptap/react";

export const CustomCodeBlock = memo(
  ({
    node: {
      attrs: { language: defaultLanguage },
    },
    updateAttributes,
    extension,
  }: NodeViewProps) => {
    return (
      <NodeViewWrapper
        className={`code-block ${defaultLanguage || ""} ${styles["code-block"]}`}
      >
        <Select
          contentEditable={false}
          defaultValue={defaultLanguage}
          onChange={(event) =>
            updateAttributes({ language: event.target.value })
          }
        >
          <option value="null">auto</option>
          <option disabled>—</option>
          {extension.options.lowlight
            .listLanguages()
            .map((lang: string, index: number) => (
              <option key={index} value={lang}>
                {lang}
              </option>
            ))}
        </Select>
        <pre>
          <NodeViewContent as="code" />
        </pre>
      </NodeViewWrapper>
    );
  }
);
CustomCodeBlock.displayName = "CustomCodeBlock";
