import { useEditorPostManagerStore } from "@/src/state/editor-post-manager";
import { FormControl, FormLabel, Textarea } from "@chakra-ui/react";

import React, { ChangeEvent, useCallback, useState } from "react";

export const SummaryInput = () => {
  const summary = useEditorPostManagerStore(
    (state) => state.activePost?.summary
  );
  const [field, setField] = useState(summary || "");
  const updateField = useEditorPostManagerStore((state) => state.updateField);
  const handleChange = useCallback(
    (evt: ChangeEvent<HTMLTextAreaElement>) => {
      const { value } = evt.target;

      setField(value);
      updateField("summary", value);
    },
    [updateField]
  );
  console.log("SummaryInput rendered", { summary });
  return (
    <FormControl>
      <FormLabel>Summary:</FormLabel>
      <Textarea
        placeholder="summary"
        name="summary"
        value={field}
        onChange={handleChange}
        maxH={150}
        rounded="lg"
      />
    </FormControl>
  );
};
